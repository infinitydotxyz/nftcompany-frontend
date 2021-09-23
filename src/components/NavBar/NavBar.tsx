import React from 'react';
import styles from './NavBar.module.scss';

export type Item = {
  title: string;
  link?: string;
};

type Props = {
  items: Item[];
  active?: number;
  onClickItem?: (item: Item, index: number) => void;
};

const NavBar = ({ items, onClickItem }: Props) => {
  return (
    <ul className={styles.main}>
      {items.map((item, idx) => {
        return (
          <li key={item.title} onClick={() => onClickItem && onClickItem(item, idx)}>
            {item.title}
          </li>
        );
      })}
    </ul>
  );
};

export default NavBar;
