import { Button } from '@chakra-ui/button';
import { Box, Link, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useRef, useState } from 'react';
import styles from './ExternalLinkCard.module.scss';

interface ExternalLinkCardProps {
  title: string;
  subtitle: string;
  link: string;
  linkText: string;
}
function ExternalLinkCard(props: ExternalLinkCardProps) {
  const [isTooltipDisabled, setIsTooltipDisabled] = useState(true);
  const textRef = useRef<any>();
  const maxWidth = 180;

  React.useEffect(() => {
    console.log(textRef.current.offsetWidth);
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
    >
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <Tooltip label={props.title} isDisabled={isTooltipDisabled} hasArrow>
          <Text ref={textRef} className={styles.titls} maxWidth={`${maxWidth}px`} isTruncated marginRight="16px">
            {props.title}
          </Text>
        </Tooltip>
        <p className={styles.subtitle}>{props.subtitle}</p>
      </Box>
      <Link _hover={{ textDecoration: 'none' }} href={props.link} target={'_blank'}>
        <Button size="sm">{props.linkText}</Button>
      </Link>
    </Box>
  );
}

export default ExternalLinkCard;
