import * as React from 'react';
import { getAccount, getChainId, getOpenSeaportForChain, getProvider, setPreferredWallet } from 'utils/ethersUtil';
import { getCustomMessage, getCustomExceptionMsg } from 'utils/commonUtil';
import { deleteAuthHeaders, getAuthHeaders, saveAuthHeaders } from 'utils/apiUtil';
const { EventType } = require('../../../opensea/types');
import { errorToast, infoToast, Toast } from 'components/Toast/Toast';
import { ReactNode } from '.pnpm/@types+react@17.0.24/node_modules/@types/react';
import { ethers, Wallet } from 'ethers';
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

// let lastError = '';
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
        setPreferredWallet();
      });
    }
  }, []);

  const connectWallet = async (walletType: WalletType) => {
    const prevProvider = getProvider();
    prevProvider?.close?.();
    if (walletType === WalletType.WalletLink) {
      const APP_NAME = 'infinity.xyz';
      const APP_LOGO_URL = `${SITE_HOST}/img/logo-mini-new.svg`;
      const ETH_JSONRPC_URL = PROVIDER_URL_MAINNET;
      const CHAIN_ID = 1;

      // Initialize WalletLink
      const walletLink = new WalletLink({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        darkMode: false
      });

      // Initialize a Web3 Provider object
      const ethereum = walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID);
      const accounts = await ethereum.send('eth_requestAccounts');

      console.log(`User's address is ${accounts[0]}`);

      // Optionally, have the default account set for web3.js
      console.log(accounts[0]);
    }

    setPreferredWallet(walletType);
    const p = getProvider();
    setProvider(p);
    signIn(p).catch((e) => {
      setPreferredWallet();
    });
  };

  React.useEffect(() => {
    console.log('provider changed');
    let isChangingAccount = false;
    const handleAccountChange = async (accounts: string[]) => {
      console.log(`account changed: ${accounts[0]}`);
      isChangingAccount = true;

      window.onfocus = async () => {
        if (isChangingAccount) {
          setTimeout(async () => {
            isChangingAccount = false;

            // reload below makes this worthless. code left for documentation
            // if we didn't page reload, we would signIn again
            await signIn();

            // use page reload for now to avoid complicated logic in other comps.
            window.location.reload();
          }, 500);
        }
      };
    };

    const handleNetworkChange = (chainId: string) => {
      console.log('network changed');
      window.location.reload();
    };

    if (provider && provider.isMetaMask) {
      (provider as any).on('accountsChanged', handleAccountChange);
      (provider as any).on('chainChanged', handleNetworkChange);
    }

    return () => {
      // on unmounting
      if (provider && provider.isMetaMask) {
        (provider as any).removeListener('accountsChanged', handleAccountChange);
        (provider as any).removeListener('chainChanged', handleNetworkChange);
      }
    };
  }, [provider]);

  React.useEffect(() => {
    console.log(`user: ${user?.account}`);

    const listener = (eventName: any, data: any) => {
      const msg = getCustomMessage(eventName, data);
      if (msg === null) {
        return;
      }
      showAppMessage(msg);
    };

    // const debouncedListener = debounce((eventName: any, data: any) => listener(eventName, data), 300); // didn't work.

    // listen to all OpenSea's "EventType" events to show them with showAppMessage:
    if (user?.account && !isListenerAdded && provider) {
      isListenerAdded = true;
      const seaport = getOpenSeaportForChain(chainId, provider);
      Object.values(EventType).forEach((eventName: any) => {
        seaport.addListener(eventName, (data: any) => listener(eventName, data), true);
      });
      // for testing: simulate OpenSea event:
      // const emitter = seaport.getEmitter();
      // console.log('emitter', emitter);
      // emitter.emit('MatchOrders', {
      //   event: 'TransactionCreated',
      //   accountAddress: '0x123',
      //   transactionHash: '0x67e01ca68c5ef37ebea8889da25849e3e5efcde6ca7fbef14fb1bc966ca4b9d0'
      // });
    }
  }, [user]);

  const signIn = async (
    optionalProvider?: ethers.providers.ExternalProvider,
    walletType?: WalletType
  ): Promise<void> => {
    setUserReady(false);
    console.log(`signing in`);
    const selectedProvider = optionalProvider ?? provider;
    if (selectedProvider) {
      const account = await getAccount(selectedProvider);

      const res = await getAuthHeaders();
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
      console.log(`Setting user to: ${account}`);
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
    const provider = getProvider();
    provider?.close?.();
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
