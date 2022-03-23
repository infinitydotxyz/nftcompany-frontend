import React from 'react';
import clsx from 'classnames';

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export const Page: React.FC<PageProps> = ({ children, className }) => {
  return <div className={clsx('page-container pb-2 pt-2 sm:pt-4 md:pt-8', className)}>{children}</div>;
};
