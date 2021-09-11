import * as React from 'react';

type User = {
  account: string;
};

export type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AppContext = React.createContext<AppContextType | null>(null);

export function AppContextProvider({ children }: any) {
  const [user, setUser] = React.useState<User | null>(null);

  const value = {
    user,
    setUser
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return React.useContext(AppContext) as AppContextType;
}
