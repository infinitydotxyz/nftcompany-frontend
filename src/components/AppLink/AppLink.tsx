import React, { ReactElement } from 'react';
import NextLink from 'next/link';
import styles from './AppLink.module.scss';

type Props = {
  type?: 'secondary';
  href: string;
  className?: string;
  children?: string | ReactElement;
};

const AppLink = ({ type, href, className = '', children }: Props) => {
  const cn = [styles.main];

  if (type === 'secondary') {
    cn.push(styles.secondary);
  }
  cn.push(className);

  return (
    <NextLink href={href}>
      <a className={cn.join(' ')}>{children}</a>
    </NextLink>
  );
};

export default AppLink;
