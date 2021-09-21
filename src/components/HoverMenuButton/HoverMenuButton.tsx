import React from 'react';
import styles from './HoverMenuButton.module.scss';
import { Menu, MenuButton, MenuList, useDisclosure } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';

type Props = {
  buttonContent?: JSX.Element;
  buttonTitle?: string;
  children: JSX.Element[] | JSX.Element;
};

export const HoverMenuButton = ({ buttonTitle, buttonContent, children }: Props) => {
  let hoverTimer: any;
  let menuListTimer: any;
  const delay = 100;

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (buttonTitle != null) {
    buttonContent = (
      <div className={styles.buttonContent}>
        <div>{buttonTitle}</div>
        <div className={styles.arrow}>
          <TriangleDownIcon fontSize={10} />
        </div>
      </div>
    );
  } else {
    buttonContent = <div className={styles.buttonContent}>{buttonContent}</div>;
  }

  return (
    <div className={styles.main}>
      {/* setting an id on menu prevents a console warning about non matching ids */}
      <Menu isLazy isOpen={isOpen} id="hover-menu">
        <MenuButton
          className={`${styles.hoverButton}  ${isOpen ? styles.menuOpen : ''}`}
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
