import React, { useState } from 'react';
import styles from './scss/TraitBox.module.scss';
import { CardData } from 'types/Nft.interface';
import { PurchaseAccordionItem, SingleAccordion } from './SingleAccordion';
import { LargeIcons } from 'components/Icons/MenuIcons';
import { Box, useColorMode } from '@chakra-ui/react';

interface Props {
  data: CardData;
}

export const TraitBox: React.FC<Props> = ({ data }: Props) => {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  return (
    <div className={styles.infoBox}>
      <SingleAccordion defaultExpandedIndex={-1}>
        <PurchaseAccordionItem dark={dark} title="Properties" icon={LargeIcons.listIcon}>
          <Box d="flex" flexWrap="wrap">
            {(data.metadata?.asset?.traits || []).map((item) => {
              return (
                <div key={`${item.traitType}_${item.traitValue}`} className={styles.traitItem}>
                  <h3>{item.traitType}</h3>
                  <div>{item.traitValue}</div>
                </div>
              );
            })}
          </Box>
        </PurchaseAccordionItem>
      </SingleAccordion>
    </div>
  );
};
