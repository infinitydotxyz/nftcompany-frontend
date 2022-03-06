import React, { useState } from 'react';
import { CardData } from '@infinityxyz/types/core/NftInterface';
import { PurchaseAccordionItem, SingleAccordion } from './SingleAccordion';
import { LargeIcons } from 'components/Icons/MenuIcons';
import { Box, useColorMode } from '@chakra-ui/react';
import styles from './scss/TraitBox.module.scss';

interface Props {
  data: CardData;
  contentOnly?: boolean;
}

export const TraitBox: React.FC<Props> = ({ data, contentOnly }: Props) => {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  const content = (
    <Box d="flex" flexWrap="wrap" w="100%">
      {(data.metadata?.asset?.traits || []).map((item) => {
        return (
          <div key={`${item.traitType}_${item.traitValue}`} className={styles.traitItem}>
            <h3>{item.traitType}</h3>
            <div>{item.traitValue}</div>
          </div>
        );
      })}
    </Box>
  );
  if (contentOnly) {
    return content;
  }

  return (
    <div className={styles.infoBox}>
      <SingleAccordion defaultExpandedIndex={0}>
        <PurchaseAccordionItem dark={dark} title="Properties" icon={LargeIcons.listIcon}>
          {content}
        </PurchaseAccordionItem>
      </SingleAccordion>
    </div>
  );
};
