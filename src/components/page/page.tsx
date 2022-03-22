import React from 'react';

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="px-4 md:px-9 lg:px-16 lg:mx-2">{children}</div>;
};
