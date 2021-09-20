import React from 'react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/tooltip';

type HelpTooltipProps = {
  text: string | JSX.Element
}

export default function HelpTooltip({ text }: HelpTooltipProps) {
  return (
    <Tooltip label={text} placement="top" hasArrow>
      <InfoOutlineIcon ml={1} />
    </Tooltip>
  );
}
