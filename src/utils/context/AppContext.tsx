import * as React from 'react';
import { debounce } from 'lodash';
import { setAuthHeaders } from 'utils/apiUtil';
import { useToast } from '@chakra-ui/toast';
// import { EventEmitter, EventSubscription } from 'fbemitter';
import { initEthers, getOpenSeaport } from 'utils/ethersUtil';
import { getCustomMessage } from 'utils/commonUtil';
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
    duration: type === 'error' ? 6000 : 3000,
    isClosable: true
  });
};

export function AppContextProvider({ children }: any) {
  const toast = useToast();
  const [user, setUser] = React.useState<User | null>(null);

  const showAppError = (message: string) => showToast(toast, 'error', message);
  const showAppMessage = (message: string) => showToast(toast, 'info', message);

  // const connectMetaMask = async () => {
  //   // show MetaMask's errors:
  //   const onError = (error: any) => {
  //     const errorMsg = error?.message;
  //     if (errorMsg === lastError) {
  //       return; // to avoid showing the same error message so many times.
  //     }
  //     if (errorMsg.indexOf('The method does not exist') >= 0) {
  //       return; // TODO: ignore this error for now.
  //     }
  //     lastError = errorMsg;
  //     showToast(toast, 'error', `MetaMask RPC Error: ${errorMsg}` || 'MetaMask RPC Error');
  //   };

  //   const res = await initEthers({ onError }); // returns provider
  //   if (res && res.getSigner) {
  //     await setAuthHeaders(await res.getSigner().getAddress());
  //   } else {
  //     showAppError('Failed to connect');
  //   }
  // };

  React.useEffect(() => {
    // connectMetaMask(); // don't auto connect on page load.

    const listener = (eventName: any, data: any) => {
      const arr: string[] = [];
      Object.keys(data).forEach((k: string) => {
        if (typeof data[k] !== 'object') {
          arr.push(`${k}: ${data[k]}`);
        }
      });
      const msg = getCustomMessage(eventName, data) || `${eventName}: ${arr.join(', ')}`;
      showAppMessage(msg);
    };

    const debouncedListener = debounce((eventName: any, data: any) => listener(eventName, data), 300);

    // listen to all OpenSea's "EventType" events to show them with showAppMessage:
    if (user?.account) {
      const seaport = getOpenSeaport();
      Object.values(EventType).forEach((eventName: any) => {
        seaport.addListener(eventName, (data: any) => debouncedListener(eventName, data), true);
      });
      // const emitter = seaport.getEmitter();
      // emitter.emit('TransactionConfirmed', { error: 'test', accountAddress: '0x123' }); // simulate OpenSea event.
    }
  }, [user]);

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
