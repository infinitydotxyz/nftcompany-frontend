import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';

type Props = {
  hasBlueCheck: boolean;
};

export const BlueCheckIcon = ({ hasBlueCheck }: Props): JSX.Element => {
  if (hasBlueCheck === true) {
    return (
      <div style={{ width: 18, height: 18 }}>
        <Tooltip label={'Verified'} placement="top" hasArrow>
          <img alt="Blue Check" src="/img/blue-check.png" />
        </Tooltip>
      </div>
    );
  }

  return <div />;
};
