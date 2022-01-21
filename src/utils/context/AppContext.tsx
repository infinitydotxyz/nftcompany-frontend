import * as React from 'react';
import { getOpenSeaportForChain } from 'utils/ethersUtil';
import { getCustomMessage, getCustomExceptionMsg } from 'utils/commonUtil';
const { EventType } = require('../../../opensea/types');
import { errorToast, infoToast, Toast } from 'components/Toast/Toast';
import { ProviderEvents, WalletType } from 'utils/providers/AbstractProvider';
import { UserRejectException } from 'utils/providers/UserRejectException';
import { ProviderManager } from 'utils/providers/ProviderManager';

export type User = {
  account: string;
};

export type AppContextType = {
  user: User | null;
  signOut: () => void;
  userReady: boolean;
  chainId: string;
  showAppError: (msg: string) => void;
  showAppMessage: (msg: string) => void;
  headerPosition: number;
  setHeaderPosition: (bottom: number) => void;
  connectWallet: (walletType: WalletType) => Promise<void>;
  providerManager?: ProviderManager;
};

const AppContext = React.createContext<AppContextType | null>(null);

let isListenerAdded = false; // set up event listeners once.

export function AppContextProvider({ children }: any) {
  const [user, setUser] = React.useState<User | null>(null);
  const [userReady, setUserReady] = React.useState(false);
  const [chainId, setChainId] = React.useState('');
  const [headerPosition, setHeaderPosition] = React.useState(0);
  const showAppError = (message: React.ReactNode) => {
    const msg = getCustomExceptionMsg(message);
    errorToast(msg);
  };
  const [providerManager, setProviderManager] = React.useState<ProviderManager | undefined>();

  const showAppMessage = (message: React.ReactNode) => infoToast(message);

  React.useEffect(() => {
    let isActive = true;
    ProviderManager.getInstance().then((providerManagerInstance) => {
      if (isActive) {
        setProviderManager(providerManagerInstance);

        providerManagerInstance
          .signIn()
          .then(() => {
            setUser({ account: providerManagerInstance.account });
            const chainId = providerManagerInstance.chainId ?? 1;
            setChainId(`${chainId}`);
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setUserReady(true);
          });
      }
    });
    return () => {
      isActive = false;
    };
  }, []);

  const connectWallet = async (walletType: WalletType) => {
    if (providerManager?.connectWallet) {
      try {
        await providerManager.connectWallet(walletType);
        await providerManager.signIn();
      } catch (err) {}

      setUser({ account: providerManager.account ?? '' });
      const chainId = providerManager.chainId ?? 1;
      setChainId(`${chainId}`);
      setUserReady(true);

      return;
    } else {
      console.log(`Provider not ready yet`);
    }
  };

  React.useEffect(() => {
    const handleNetworkChange = (chainId: number) => {
      setChainId(`${chainId}`);
      window.location.reload();
    };

    let isChangingAccount = false;
    const handleAccountChange = async (account: string) => {
      isChangingAccount = true;
      window.onfocus = async () => {
        if (isChangingAccount) {
          setTimeout(async () => {
            isChangingAccount = false;
            try {
              await providerManager?.signIn();
              setUser({ account: providerManager?.account ?? '' });
              const chainId = providerManager?.chainId ?? 1;
              setChainId(`${chainId}`);
            } catch (err) {
              if (err instanceof UserRejectException) {
                showAppError(err.message);
                return;
              }
              console.error(err);
            }
            window.location.reload();
          }, 500);
        }
      };
    };

    const onConnect = () => {
      return;
    };

    const onDisconnect = () => {
      signOut();
    };

    if (providerManager) {
      providerManager.on(ProviderEvents.AccountsChanged, handleAccountChange);
      providerManager.on(ProviderEvents.ChainChanged, handleNetworkChange);
      providerManager.on(ProviderEvents.Connect, onConnect);
      providerManager.on(ProviderEvents.Disconnect, onDisconnect);
    }

    return () => {
      providerManager?.removeListener?.(ProviderEvents.AccountsChanged, handleAccountChange);
      providerManager?.removeListener?.(ProviderEvents.ChainChanged, handleNetworkChange);
      providerManager?.removeListener?.(ProviderEvents.Connect, onConnect);
      providerManager?.removeListener?.(ProviderEvents.Disconnect, onDisconnect);
    };
  }, [providerManager]);

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
    if (user?.account && !isListenerAdded && providerManager) {
      isListenerAdded = true;
      const seaport = getOpenSeaportForChain(chainId, providerManager);
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

  const signOut = async (): Promise<void> => {
    setUser(null);
    providerManager?.disconnect();
    window.location.reload();
  };

  const value: AppContextType = {
    user,
    signOut,
    userReady,
    chainId,
    showAppError,
    showAppMessage,
    headerPosition,
    setHeaderPosition,
    connectWallet,
    providerManager
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
