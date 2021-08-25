import React from 'react';
import { FilterContext } from '../hooks/useFilter';

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
      <FilterContext.Provider value={{ filter, setFilter }}>
        {(landing && <LandingHeader />) || <Header />}
        <main>{children}</main>
        {landing && <LandingFooter />}
      </FilterContext.Provider>
    </>
  );
};

export default Layout;
