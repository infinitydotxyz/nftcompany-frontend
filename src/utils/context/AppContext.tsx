import * as React from 'react';
import { getAccount, getOpenSeaport } from 'utils/ethersUtil';
import { getCustomMessage } from 'utils/commonUtil';
import { deleteAuthHeaders } from 'utils/apiUtil';
const { EventType } = require('../../../opensea/types');

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactNode } from '.pnpm/@types+react@17.0.24/node_modules/@types/react';

export type User = {
  account: string;
};

export type AppContextType = {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  userReady: boolean;
  showAppError: (msg: string) => void;
  showAppMessage: (msg: string) => void;
};

const AppContext = React.createContext<AppContextType | null>(null);

// let lastError = '';
let lastMsg = '';
let isListenerAdded = false; // set up event listeners once.

export function AppContextProvider({ children }: any) {
  const [user, setUser] = React.useState<User | null>(null);
  const [userReady, setUserReady] = React.useState(false);

  const showAppError = (message: ReactNode) => toast.error(message, { position: 'bottom-center'});
  const showAppMessage = (message: ReactNode) => toast.info(message, { position: 'bottom-center'});

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
  //     await saveAuthHeaders(await res.getSigner().getAddress());
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
      console.log('eventName, data', eventName, data);
      const msg = getCustomMessage(eventName, data) || `${eventName}: ${arr.join(', ')}`;
      if (lastMsg && msg === lastMsg) {
        // TODO: to avoid show dup messages.
        lastMsg = '';
        return;
      }
      lastMsg = `${msg}`;
      showAppMessage(msg);
    };

    // const debouncedListener = debounce((eventName: any, data: any) => listener(eventName, data), 300); // didn't work.

    // listen to all OpenSea's "EventType" events to show them with showAppMessage:
    console.log('user?.account', user?.account);
    if (user?.account && !isListenerAdded) {
      isListenerAdded = true;
      const seaport = getOpenSeaport();
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

  const signIn = async (): Promise<void> => {
    if (window.ethereum) {
      setUser({ account: await getAccount() });
    }

    // views can avoid drawing until a login attempt was made to avoid a user=null and user='xx' refresh
    setUserReady(true);
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    deleteAuthHeaders();
  };

  const value: AppContextType = {
    user,
    signIn,
    signOut,
    userReady,

    showAppError,
    showAppMessage
  };

  return (
    <AppContext.Provider value={value}>
      {children} <ToastContainer position="bottom-right" />
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  return React.useContext(AppContext) as AppContextType;
}
