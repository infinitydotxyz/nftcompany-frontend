import * as React from 'react';
import { initEthers } from 'utils/ethersUtil';
import { setAuthHeaders } from 'utils/apiUtil';
import { useToast } from '@chakra-ui/toast';
// import { EventEmitter, EventSubscription } from 'fbemitter';
import { getOpenSeaport } from 'utils/ethersUtil';
const { EventType } = require('../../../opensea/types');

export type User = {
  account: string;
};

export type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  showAppError: (msg: string) => void;
  showAppMessage: (msg: string) => void;
};

const AppContext = React.createContext<AppContextType | null>(null);

let lastError = '';

const showToast = (toast: any, type: 'success' | 'error' | 'warning' | 'info', message: string) => {
  toast({
    title: type === 'error' ? 'Error' : 'Info',
    description: message,
    status: type,
    duration: type === 'error' ? 10000 : 4000,
    isClosable: true
  });
};

export function AppContextProvider({ children }: any) {
  const toast = useToast();
  const [user, setUser] = React.useState<User | null>(null);

  const showAppError = (message: string) => showToast(toast, 'error', message);
  const showAppMessage = (message: string) => showToast(toast, 'info', message);

  const connectMetaMask = async () => {
    const onError = (error: any) => {
      if (error?.message === lastError) {
        return; // to avoid showing the same error message so many times.
      }
      lastError = error?.message;
      showToast(toast, 'error', `MetaMask RPC Error: ${error?.message}` || 'MetaMask RPC Error');
    };
    const res = await initEthers({ onError }); // returns provider

    if (res && res.getSigner) {
      await setAuthHeaders(await res.getSigner().getAddress());
    } else {
      showAppError('Failed to connect.');
    }
  };

  React.useEffect(() => {
    connectMetaMask();

    // listen to all OpenSea's "EventType" events to show them with showAppMessage:
    const seaport = getOpenSeaport();
    Object.values(EventType).forEach((eventName: any) => {
      seaport.addListener(
        eventName,
        (data: any) => {
          const arr: string[] = [];
          Object.keys(data).forEach((k: string) => {
            if (typeof data[k] !== 'object') {
              arr.push(`${k}: ${data[k]}`);
            }
          });
          showAppMessage(`${eventName}: ${arr.join(', ')}`);
        },
        true
      );
    });
    const emitter = seaport.getEmitter();
    // emitter.emit('TransactionConfirmed', { error: 'test', accountAddress: '0x123' }); // simulate OpenSea event.
  }, []);

  const value = {
    user,
    setUser,
    showAppError,
    showAppMessage
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return React.useContext(AppContext) as AppContextType;
}
