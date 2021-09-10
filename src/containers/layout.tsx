import React from 'react';
import { FilterContext } from '../hooks/useFilter';
import { AppContextProvider } from 'utils/context/AppContext';

import Header from './header';
import LandingHeader from './LandingHeader';
import LandingFooter from './footer';

interface IProps {
  children: any;
  landing?: boolean;
}

const Layout: React.FC<IProps> = ({ landing, children }: IProps) => {
  const [filter, setFilter] = React.useState<any>({ search: '' });
  return (
    <>
      <AppContextProvider>
        <FilterContext.Provider value={{ filter, setFilter }}>
          {(landing && <LandingHeader />) || <Header />}
          <main>{children}</main>
          {landing && <LandingFooter />}
        </FilterContext.Provider>
      </AppContextProvider>
    </>
  );
};

export default Layout;
