import React from 'react';

type Props = {
  isActive: boolean;
  [key: string]: any;
};

function MenuToggler({ isActive, ...props }: Props) {
  return (
    <button className={`hamburger ${isActive && 'hamburger--spin is-active'}`} type="button" {...props}>
      <span className="hamburger-box">
        <span className="hamburger-inner"></span>
      </span>
    </button>
  );
}

export default MenuToggler;
