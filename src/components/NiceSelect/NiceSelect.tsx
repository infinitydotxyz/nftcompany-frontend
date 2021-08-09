import React, { ReactElement } from 'react';
import { bindNiceSelect } from './NiceSelectUtil';
// import './NiceSelect.css';

type Props = {
  id: string;
  children?: ReactElement | ReactElement[] | undefined;
  [key: string]: any;
}

export default function NiceSelect({ id, children, ...otherProps }: Props) {
  React.useEffect(() => {
    const el = document.getElementById(id);
    bindNiceSelect(el, {});
  }, []);

  return (
    <select id={id} {...otherProps}>
      {children}
    </select>
  );
}
