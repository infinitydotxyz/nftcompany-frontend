import React from 'react';
import styles from './Text.module.scss';

type Props = {
  text: string;
  size?: 'sm' | 'med' | 'lg';
  align?: 'start' | 'end' | 'center';
  shade?: 'light' | 'med' | 'full';
  bold?: boolean;
  mt?: boolean;
  mb?: boolean;
  className?: string;
};

export const Text = ({
  className,
  size = 'med',
  align = 'start',
  shade = 'med',
  text,
  bold = false,
  mt = false,
  mb = false
}: Props) => {
  const classes: string[] = [];

  if (className) {
    classes.push(className);
  }

  if (bold) {
    classes.push(styles.bold);
  }

  if (mt) {
    classes.push(styles.topMargin);
  }

  if (mb) {
    classes.push(styles.bottomMargin);
  }

  switch (size) {
    case 'sm':
      classes.push(styles.sm);
      break;
    case 'lg':
      classes.push(styles.lg);
      break;
    case 'med':
      classes.push(styles.med);
    default:
      break;
  }

  switch (shade) {
    case 'light':
      classes.push(styles.light);
      break;
    case 'med':
      classes.push(styles.med);
      break;
    case 'full':
      classes.push(styles.full);
    default:
      break;
  }

  switch (align) {
    case 'start':
      classes.push(styles.start);
      break;
    case 'end':
      classes.push(styles.end);
      break;
    case 'center':
      classes.push(styles.center);
    default:
      break;
  }

  return <div className={classes.join(' ')}>{text}</div>;
};

export const Label = (props: Props) => {
  const { size, shade, mt = false, mb = false } = props;

  return <Text {...props} size={size ?? 'sm'} mt={mt} mb={mb} shade={shade ?? 'light'} />;
};

export const Title = (props: Props) => {
  const { size, shade, className, mt = false, mb = true } = props;

  const classes = className ?? '';

  return <Text {...props} mt={mt} mb={mb} size={size ?? 'lg'} shade={shade ?? 'med'} className={classes} />;
};
