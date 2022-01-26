import React from 'react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/tooltip';
import { Box } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/react';

type HelpTooltipProps = {
  text: string | JSX.Element;
};

const HelpTooltip = ({ text, ...rest }: HelpTooltipProps & ChakraProps): JSX.Element => {
  return (
    <Tooltip label={<Box p={3}>{text}</Box>} placement="top" hasArrow>
      <InfoOutlineIcon ml={2} {...rest} />
    </Tooltip>
  );
};

export default HelpTooltip;
