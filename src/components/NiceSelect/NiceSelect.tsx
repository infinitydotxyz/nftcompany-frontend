import React, { ReactElement } from 'react';
import { bindNiceSelect } from './NiceSelectUtil';
// import './NiceSelect.css';

type Props = {
  id: string;
  children?: ReactElement | ReactElement[] | undefined;
  value: any;
  onChange?: React.ChangeEventHandler<HTMLSelectElement> | undefined;
  [key: string]: any;
};

export default function NiceSelect({ id, children, value, onChange, ...otherProps }: Props) {
  React.useEffect(() => {
    const el = document.getElementById(id);
    // on value changed, remove the existing .nice-select (if any) to rebuild it:
    const el2: any = el?.parentElement?.querySelector('.nice-select');
    if (el2) {
      el2.remove();
    }
    bindNiceSelect(el, {});
  }, [id, value]);

  return (
    <select id={id} onChange={onChange} {...otherProps}>
      {children}
    </select>
  );
}
