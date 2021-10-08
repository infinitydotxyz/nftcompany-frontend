import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';

type Props = {
  hasBlueCheck: boolean;
};

export const BlueCheckIcon = ({ hasBlueCheck }: Props): JSX.Element => {
  if (hasBlueCheck === true) {
    return (
      <i>
        <Tooltip label={'Verified'} placement="top" hasArrow>
          <img alt="Blue Check" width={24} height={24} src="/img/blue-check.png" />
        </Tooltip>
      </i>
    );
  }

  return <div />;
};
