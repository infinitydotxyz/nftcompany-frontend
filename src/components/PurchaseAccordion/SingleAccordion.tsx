import React, { useState } from 'react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react';
import styles from './scss/SingleAccordion.module.scss';

interface IProps {
  title: string;
  icon: JSX.Element;
  children: JSX.Element;
  dark: boolean;
}

export const PurchaseAccordionItem: React.FC<IProps> = ({ dark, icon, title, children }: IProps) => {
  // I wish this could go in the scss file, but not sure how
  // const expandedStyle = { bg: dark ? 'rgba(25, 255, 255, .41)' : 'rgba(255, 255, 255, .8)' };

  return (
    <AccordionItem style={{ border: 'none' }}>
      {/* <AccordionButton className={styles.accordionButton} _expanded={expandedStyle}> */}
      <AccordionButton className={styles.accordionButton}>
        {icon}
        <div className={styles.title}>{title}</div>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel className={styles.accordionPanel}>{children}</AccordionPanel>
    </AccordionItem>
  );
};

// ======================================================================
// ======================================================================

interface EProps {
  children: JSX.Element;
  defaultExpandedIndex?: number;
}

export const SingleAccordion: React.FC<EProps> = ({ children, defaultExpandedIndex }: EProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number[]>([defaultExpandedIndex ?? 0]);

  return (
    <div className={styles.singleAccordion}>
      <Accordion
        defaultIndex={[0]}
        index={expandedIndex}
        allowMultiple
        onChange={(index) => {
          if (Array.isArray(index)) {
            setExpandedIndex(index);
          } else {
            setExpandedIndex([index]);
          }
        }}
      >
        {children}
      </Accordion>
    </div>
  );
};
