import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';

type Props = {
  hasBlueCheck: boolean;
  large?: boolean;
};

export const BlueCheckIcon = ({ large = false, hasBlueCheck }: Props): JSX.Element => {
  if (hasBlueCheck === true) {
    return (
      <div style={{ width: large ? 24 : 16, height: large ? 24 : 16 }}>
        <Tooltip label={'Verified'} placement="top" hasArrow>
          <img alt="Blue Check" src="/img/blue-check.png" />
        </Tooltip>
      </div>
    );
  }

  return <div />;
};
