import React from 'react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/tooltip';
import { Box } from '@chakra-ui/layout';

type HelpTooltipProps = {
  text: string | JSX.Element;
};

export default function HelpTooltip({ text }: HelpTooltipProps) {
  return (
    <Tooltip label={<Box p={3}>{text}</Box>} placement="top" hasArrow>
      <InfoOutlineIcon ml={2} />
    </Tooltip>
  );
}
