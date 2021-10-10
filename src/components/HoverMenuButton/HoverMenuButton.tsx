import React, { MouseEventHandler } from 'react';
import styles from './HoverMenuButton.module.scss';
import { Menu, MenuButton, MenuList, useColorMode, useDisclosure } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';

type Props = {
  buttonContent?: JSX.Element;
  buttonTitle?: string;
  children: JSX.Element[] | JSX.Element;
  shadow?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<any>;
};

export const HoverMenuButton = ({
  disabled = false,
  shadow = false,
  arrow = true,
  buttonTitle,
  buttonContent,
  children,
  onClick
}: Props) => {
  let hoverTimer: any;
  let menuListTimer: any;
  const delay = 100;

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (buttonTitle?.length) {
    buttonContent = (
      <div className={styles.buttonContent}>
        <div>{buttonTitle}</div>

        {arrow && (
          <div className={styles.arrow}>
            <TriangleDownIcon fontSize={10} />
          </div>
        )}
      </div>
    );
  } else {
    buttonContent = <div className={styles.buttonContent}>{buttonContent}</div>;
  }

  const buttonClass = [styles.hoverButton];

  if (isOpen) {
    buttonClass.push(styles.menuOpen);
  }

  if (shadow) {
    buttonClass.push(styles.buttonShadow);
  }

  if (disabled) {
    buttonClass.push(styles.disabled);
  }

  return (
    <div className={styles.main}>
      {/* setting an id on menu prevents a console warning about non matching ids */}
      <Menu isLazy isOpen={isOpen} id="hover-menu">
        <MenuButton
          onClick={onClick}
          disabled={disabled}
          className={buttonClass.join(' ')}
          onMouseEnter={() => {
            clearTimeout(menuListTimer);
            if (!isOpen) {
              onOpen();
            }
          }}
          onMouseLeave={() => {
            hoverTimer = setTimeout(onClose, delay);
          }}
        >
          {buttonContent}
        </MenuButton>

        <MenuList
          onClick={onClose}
          onMouseLeave={() => {
            menuListTimer = setTimeout(onClose, delay);
          }}
          onMouseEnter={() => {
            clearTimeout(hoverTimer);
          }}
        >
          {children}
        </MenuList>
      </Menu>
    </div>
  );
};
