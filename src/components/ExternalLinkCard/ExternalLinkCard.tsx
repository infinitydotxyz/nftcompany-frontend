import { Button } from '@chakra-ui/button';
import { Box, Link, Text } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useRef, useState } from 'react';
import styles from './ExternalLinkCard.module.scss';

interface BaseProps {
  title: string;
  subtitle: string;
  linkText: string;
}
interface ExternalLinkCardProps extends BaseProps {
  link: string;
}

interface ExternalLinkCardButtonProps extends BaseProps {
  onClick: () => void;
}

type Props = (ExternalLinkCardButtonProps | ExternalLinkCardProps) & ChakraProps;

function ExternalLinkCard(props: Props) {
  let link, linkText, title, subtitle, onClick;
  let rest;
  if ('onClick' in props) {
    const {
      title: buttonTitle,
      subtitle: buttonSubtitle,
      onClick: onButtonClick,
      linkText: buttonText,
      ...propsRest
    } = props;
    title = buttonTitle;
    subtitle = buttonSubtitle;
    onClick = onButtonClick;
    linkText = buttonText;
    rest = propsRest;
  } else {
    const {
      title: buttonTitle,
      subtitle: buttonSubtitle,
      link: buttonLink,
      linkText: buttonText,
      ...propsRest
    } = props;
    title = buttonTitle;
    subtitle = buttonSubtitle;
    link = buttonLink;
    linkText = buttonText;
    rest = propsRest;
  }
  const [isTooltipDisabled, setIsTooltipDisabled] = useState(true);
  const textRef = useRef<any>();
  const maxWidth = 100;

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
      minWidth={'200px'}
      maxWidth={'250px'}
      minHeight={'64px'}
      {...rest}
    >
      <Box display="flex" flexDirection="column" justifyContent="space-between" flexBasis={0} flexGrow={2}>
        <Tooltip label={title} isDisabled={isTooltipDisabled} hasArrow>
          <Text ref={textRef} className={styles.titls} maxWidth={`${maxWidth}px`} isTruncated marginRight="16px">
            {title}
          </Text>
        </Tooltip>
        <p className={styles.subtitle}>{subtitle}</p>
      </Box>
      {'onClick' in props && (
        <Link _hover={{ textDecoration: 'none' }}>
          <Button size="sm" _hover={{ textDecoration: 'none' }} flexBasis={0} flexGrow={1} onClick={onClick}>
            {linkText}
          </Button>
        </Link>
      )}
      {'link' in props && (
        <Link _hover={{ textDecoration: 'none' }} href={link} target={'_blank'}>
          <Button size="sm" flexBasis={0} flexGrow={1}>
            {linkText}
          </Button>
        </Link>
      )}
    </Box>
  );
}

export default ExternalLinkCard;
