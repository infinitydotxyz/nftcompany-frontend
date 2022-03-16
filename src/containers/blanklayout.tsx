import React from 'react';
import { AppContextProvider } from 'utils/context/AppContext';
import { AppChakraProvider } from 'utils/themeUtil';

const BlankLayout: React.FC = ({ children }) => {
  return (
    <>
      <AppChakraProvider>
        <AppContextProvider>{children}</AppContextProvider>
      </AppChakraProvider>
    </>
  );
};

export default BlankLayout;
