import { Box } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/react';

function HorizontalLine(props: ChakraProps) {
  return <Box width="100%" height="0px" borderBottom="2px solid" borderColor={'separator'} {...props}></Box>;
}

export default HorizontalLine;
