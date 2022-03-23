import React from 'react';

export const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="page-container pb-2 pt-2 sm:pt-4 md:pt-8">{children}</div>;
};
