import React from 'react';
import styles from './HoverMenuButton.module.scss';
import { Menu, MenuButton, MenuList, useDisclosure } from '@chakra-ui/react';

type Props = {
  buttonContent: JSX.Element;
  children: JSX.Element[];
};

export const HoverMenuButton = ({ buttonContent, children }: Props) => {
  let hoverTimer: any;
  let menuListTimer: any;
  const delay = 200;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className={styles.main}>
      <Menu isLazy isOpen={isOpen} offset={[0, 10]}>
        <MenuButton
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
