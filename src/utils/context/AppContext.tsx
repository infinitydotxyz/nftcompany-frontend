import * as React from 'react';
import { initEthers } from 'utils/ethersUtil'
import { setAuthHeaders } from 'utils/apiUtil'
import { useToast } from '@chakra-ui/toast';
import { showMessage } from 'utils/commonUtil';

type User = {
  account: string;
};

export type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  showAppError: (msg: string) => void;
  showAppMessage: (msg: string) => void;
};

const AppContext = React.createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: any) {
  const toast = useToast();
  const [user, setUser] = React.useState<User | null>(null);

  const showAppError = (message: string) => showMessage(toast, 'error', message);

  const showAppMessage = (message: string) => showMessage(toast, 'info', message);

  const connectMetaMask = async () => {
    const onError = (error: any) => {
      showMessage(toast, 'error', `MetaMask RPC Error: ${error?.message}` || 'MetaMask RPC Error')
    }
    const res = await initEthers({ onError }); // returns provider
    if (res && res.getSigner) {
      await setAuthHeaders(await res.getSigner().getAddress());
    } else {
      alert('Failed to connect.'); // TODO: use a toaster
    }
    // console.log("Address: ", await res.getAddress());
  };
  React.useEffect(() => {
    connectMetaMask();
  }, [])

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
