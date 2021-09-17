import React from 'react';
import styles from './HoverMenuButton.module.scss';
import { Menu, MenuButton, MenuList, useDisclosure } from '@chakra-ui/react';

type Props = {
  buttonContent?: JSX.Element;
  buttonTitle?: string;
  children: JSX.Element[];
};

export const HoverMenuButton = ({ buttonTitle, buttonContent, children }: Props) => {
  let hoverTimer: any;
  let menuListTimer: any;
  const delay = 200;
  let addStyle = false;

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (buttonTitle != null) {
    addStyle = true;
    buttonContent = <div>{buttonTitle}</div>;
  }

  return (
    <div className={styles.main}>
      <Menu isLazy isOpen={isOpen}>
        <MenuButton
          className={`${styles.hoverButton}  ${addStyle && isOpen ? styles.menuOpen : ''}`}
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
            hoverTimer = null;
          }}
        >
          {children}
        </MenuList>
      </Menu>
    </div>
  );
};
