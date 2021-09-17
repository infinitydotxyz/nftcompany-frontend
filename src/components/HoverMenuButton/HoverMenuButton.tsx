import React from 'react';
import styles from './HoverMenuButton.module.scss';
import { Menu, MenuButton, MenuList, useDisclosure } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';

type Props = {
  buttonContent?: JSX.Element;
  buttonTitle?: string;
  children: JSX.Element[];
};

export const HoverMenuButton = ({ buttonTitle, buttonContent, children }: Props) => {
  let hoverTimer: any;
  let menuListTimer: any;
  const delay = 100;
  let addStyle = false;

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (buttonTitle != null) {
    addStyle = true;
    buttonContent = (
      <div className={styles.buttonContent}>
        <div>{buttonTitle}</div>
        <div className={styles.arrow}>
          <TriangleDownIcon fontSize={10} />
        </div>
      </div>
    );
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
          }}
        >
          {children}
        </MenuList>
      </Menu>
    </div>
  );
};
