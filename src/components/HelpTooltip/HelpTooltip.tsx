import React from 'react';
import { InfoIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/tooltip';

type HelpTooltipProps = {
  text: string | JSX.Element
}

export default function HelpTooltip({ text }: HelpTooltipProps) {
  return (
    <Tooltip label={text} placement="top" hasArrow>
      <InfoIcon />
    </Tooltip>
  );
}
