import React, { ReactElement } from 'react';
import { bindNiceSelect } from './NiceSelectUtil';
// import './NiceSelect.css';

type Props = {
  id: string;
  children?: ReactElement | ReactElement[] | undefined;
  onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined;
  [key: string]: any;
}

export default function NiceSelect({ id, children, onChange, ...otherProps }: Props) {
  React.useEffect(() => {
    const el = document.getElementById(id);
    bindNiceSelect(el, {});
  }, []);

  return (
    <select id={id} onChange={onChange} {...otherProps}>
      {children}
    </select>
  );
}
