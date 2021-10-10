import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';

type Props = {
  hasBlueCheck: boolean;
};

export const BlueCheckIcon = ({ hasBlueCheck }: Props): JSX.Element => {
  if (hasBlueCheck === true) {
    return (
      <>
        <Tooltip label={'Verified'} placement="top" hasArrow>
          <img alt="Blue Check" width={20} height={20} src="/img/blue-check.png" />
        </Tooltip>
      </>
    );
  }

  return <div />;
};
