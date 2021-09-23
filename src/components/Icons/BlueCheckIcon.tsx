import React from 'react';

type Props = {
  hasBlueCheck: boolean;
};

export const BlueCheckIcon = ({ hasBlueCheck }: Props): JSX.Element => {
  if (hasBlueCheck === true) {
    return <img alt="Blue Check" width={24} height={24} src="/img/blue-check.png" />;
  }

  return <div />;
};
