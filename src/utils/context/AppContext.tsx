import * as React from 'react';
import { getAccount, getChainId, getOpenSeaportForChain, getProvider, setPreferredWallet } from 'utils/ethersUtil';
import { getCustomMessage, getCustomExceptionMsg } from 'utils/commonUtil';
import { deleteAuthHeaders, getAuthHeaders, saveAuthHeaders } from 'utils/apiUtil';
const { EventType } = require('../../../opensea/types');
import { errorToast, infoToast, Toast } from 'components/Toast/Toast';
import { ReactNode } from '.pnpm/@types+react@17.0.24/node_modules/@types/react';
import { ethers } from 'ethers';
import WalletLink from 'walletlink';
import { PROVIDER_URL_MAINNET, SITE_HOST } from 'utils/constants';

export type User = {
  account: string;
};

export type AppContextType = {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  userReady: boolean;
  chainId: string;
  showAppError: (msg: string) => void;
  showAppMessage: (msg: string) => void;
  headerPosition: number;
  setHeaderPosition: (bottom: number) => void;
  provider?: ethers.providers.ExternalProvider;
  connectWallet: (walletType: WalletType) => Promise<void>;
};

export enum WalletType {
  MetaMask = 'MetaMask',
  WalletLink = 'WalletLink',
  WalletConnect = 'WalletConnect'
}

const AppContext = React.createContext<AppContextType | null>(null);

let isListenerAdded = false; // set up event listeners once.

export function AppContextProvider({ children }: any) {
  const [user, setUser] = React.useState<User | null>(null);
  const [userReady, setUserReady] = React.useState(false);
  const [chainId, setChainId] = React.useState('');
  const [headerPosition, setHeaderPosition] = React.useState(0);
  const showAppError = (message: ReactNode) => {
    const msg = getCustomExceptionMsg(message);
    errorToast(msg);
  };
  const showAppMessage = (message: ReactNode) => infoToast(message);
  const [provider, setProvider] = React.useState<ethers.providers.ExternalProvider | undefined>();

  React.useEffect(() => {
    const windowProvider = getProvider();
    setProvider(windowProvider);
    if (windowProvider) {
      signIn(windowProvider).catch((e) => {
        console.error(e);
        setPreferredWallet();
      });
    }
  }, []);

  const connectWallet = async (walletType: WalletType) => {
    let walletLink;
    if (walletType === WalletType.WalletLink) {
      const APP_NAME = 'infinity.xyz';
      const APP_LOGO_URL = `${SITE_HOST}/favicon.ico`;
      const ETH_JSONRPC_URL = PROVIDER_URL_MAINNET;
      const CHAIN_ID = 1;

      walletLink = new WalletLink({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL, // todo doesn't work https://github.com/walletlink/walletlink/issues/199
        darkMode: false
      });

      (window?.walletLinkExtension as any)?.setAppInfo?.(APP_NAME, APP_LOGO_URL);

      const ethereum = walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID);
      await ethereum.send('eth_requestAccounts');
    } else if (walletType === WalletType.WalletConnect) {
      throw new Error('Wallet connect not yet supported');
    }

    setPreferredWallet(walletType);
    const provider = getProvider();
    setProvider(provider);
    signIn().catch((e) => {
      console.error(e);
      setPreferredWallet();
    });
  };

  React.useEffect(() => {
    let isChangingAccount = false;
    const handleAccountChange = async (accounts: string[]) => {
      isChangingAccount = true;
      window.onfocus = async () => {
        if (isChangingAccount) {
          setTimeout(async () => {
            isChangingAccount = false;
            await signIn();
            window.location.reload();
          }, 500);
        }
      };
    };

    const handleNetworkChange = (chainId: string) => {
      setChainId(chainId);
      window.location.reload();
    };

    if (provider) {
      (provider as any).on('accountsChanged', handleAccountChange);
      (provider as any).on('chainChanged', handleNetworkChange);
    }

    return () => {
      if (provider && provider.isMetaMask) {
        (provider as any).removeListener('accountsChanged', handleAccountChange);
        (provider as any).removeListener('chainChanged', handleNetworkChange);
      }
    };
  }, [provider]);

  React.useEffect(() => {
    const listener = (eventName: any, data: any) => {
      const msg = getCustomMessage(eventName, data);
      if (msg === null) {
        return;
      }
      showAppMessage(msg);
    };

    const subscriptions: any[] = [];
    // listen to all OpenSea's "EventType" events to show them with showAppMessage:
    if (user?.account && !isListenerAdded && provider) {
      isListenerAdded = true;
      const seaport = getOpenSeaportForChain(chainId, provider);
      Object.values(EventType).forEach((eventName: any) => {
        const subscription = seaport.addListener(eventName, (data: any) => listener(eventName, data), true);
        subscriptions.push(subscription);
      });

      // for testing: simulate OpenSea event:
      // const emitter = seaport.getEmitter();
      // console.log('emitter', emitter);
      // emitter.emit('MatchOrders', {
      //   event: 'TransactionCreated',
      //   accountAddress: '0x123',
      //   transactionHash: '0x67e01ca68c5ef37ebea8889da25849e3e5efcde6ca7fbef14fb1bc966ca4b9d0'
      // });
      return () => {
        for (const subscription of subscriptions) {
          seaport.removeListener(subscription);
        }
      };
    }
  }, [user]);

  const signIn = async (
    optionalProvider?: ethers.providers.ExternalProvider,
    walletType?: WalletType
  ): Promise<void> => {
    setUserReady(false);
    const selectedProvider = optionalProvider ?? getProvider();
    if (selectedProvider) {
      let account;
      account = await getAccount(selectedProvider);
      if (!account) {
        // wallet locked, use this to open the wallet
        const accounts = await selectedProvider.send('eth_requestAccounts');
        account = accounts.result[0];
      }

      const res = await getAuthHeaders(selectedProvider);
      const msg = res['X-AUTH-MESSAGE'];
      const sig = res['X-AUTH-SIGNATURE'];
      let signedAccount = '';
      if (msg && sig) {
        const parsed = JSON.parse(sig);
        signedAccount = ethers.utils.verifyMessage(msg, parsed);
      }
      if (signedAccount !== account) {
        await saveAuthHeaders(account, selectedProvider);
      }

      const chainId = await getChainId(selectedProvider);
      setUser({ account });
      setChainId(chainId);
      if (walletType) {
        setPreferredWallet(walletType);
      }
    }

    // views can avoid drawing until a login attempt was made to avoid a user=null and user='xx' refresh
    setUserReady(true);
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    deleteAuthHeaders();
    setPreferredWallet();
  };

  const value: AppContextType = {
    user,
    signIn,
    signOut,
    userReady,
    chainId,
    showAppError,
    showAppMessage,
    headerPosition,
    setHeaderPosition,
    provider,
    connectWallet
  };

  return (
    <AppContext.Provider value={value}>
      {children} <Toast />
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  return React.useContext(AppContext) as AppContextType;
}
