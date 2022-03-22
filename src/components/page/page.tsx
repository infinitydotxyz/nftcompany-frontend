import React from 'react';

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mx-auto px-4 md:px-9 lg:px-16 xl:px-20 max-w-screen-2xl">{children}</div>;
};
