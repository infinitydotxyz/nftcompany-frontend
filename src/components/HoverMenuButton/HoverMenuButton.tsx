import React, { MouseEventHandler, useState } from 'react';
import styles from './HoverMenuButton.module.scss';
import { Menu, MenuButton, MenuList, MenuItem, useColorMode, useDisclosure } from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useWindowSize } from '@react-hook/window-size';

type Props = {
  buttonContent?: JSX.Element;
  buttonTitle?: string;
  children?: JSX.Element[] | JSX.Element;
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, height] = useWindowSize();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (buttonTitle?.length) {
    buttonContent = (
      <div className={styles.buttonContent}>
        <div>{buttonTitle}</div>

        {arrow && children && (
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

  const menuButton = (
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
  );

  if (!children) {
    return (
      <div className={styles.main}>
        <Menu isOpen={isOpen} id="hover-menu">
          {menuButton}
        </Menu>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {/* setting an id on menu prevents a console warning about non matching ids */}

      {/* Adding condition with mobile here to remove the bug with mobile menu*/}
      {width <= 650 ? (
        <Menu isLazy id="hover-menu">
          {menuButton}

          <MenuList
            onClick={onClose}
            onMouseLeave={() => {
              menuListTimer = setTimeout(onClose, delay);
            }}
            onMouseEnter={() => {
              clearTimeout(hoverTimer);
            }}
            className={styles.menuList}
          >
            {children}
          </MenuList>
        </Menu>
      ) : (
        <Menu isLazy isOpen={isOpen} id="hover-menu">
          {menuButton}

          <MenuList
            onClick={onClose}
            onMouseLeave={() => {
              menuListTimer = setTimeout(onClose, delay);
            }}
            onMouseEnter={() => {
              clearTimeout(hoverTimer);
            }}
            className={styles.menuList}
          >
            {children}
          </MenuList>
        </Menu>
      )}
    </div>
  );
};
