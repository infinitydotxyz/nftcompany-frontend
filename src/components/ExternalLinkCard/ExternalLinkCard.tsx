import { Button } from '@chakra-ui/button';
import { Box, Link, Text } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useRef, useState } from 'react';
import styles from './ExternalLinkCard.module.scss';

interface ExternalLinkCardProps {
  title: string;
  subtitle: string;
  link: string;
  linkText: string;
}

function ExternalLinkCard({ title, subtitle, link, linkText, ...rest }: ExternalLinkCardProps & ChakraProps) {
  const [isTooltipDisabled, setIsTooltipDisabled] = useState(true);
  const textRef = useRef<any>();
  const maxWidth = 180;

  React.useEffect(() => {
    if (textRef.current?.offsetWidth && textRef.current?.offsetWidth >= maxWidth) {
      setIsTooltipDisabled(false);
    }
  }, [textRef.current]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      borderRadius={'8px'}
      backgroundColor={'cardBgLight'}
      padding="16px"
      minWidth={'250px'}
      maxWidth={'300px'}
      {...rest}
    >
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <Tooltip label={title} isDisabled={isTooltipDisabled} hasArrow>
          <Text ref={textRef} className={styles.titls} maxWidth={`${maxWidth}px`} isTruncated marginRight="16px">
            {title}
          </Text>
        </Tooltip>
        <p className={styles.subtitle}>{subtitle}</p>
      </Box>
      <Link _hover={{ textDecoration: 'none' }} href={link} target={'_blank'}>
        <Button size="sm">{linkText}</Button>
      </Link>
    </Box>
  );
}

export default ExternalLinkCard;
