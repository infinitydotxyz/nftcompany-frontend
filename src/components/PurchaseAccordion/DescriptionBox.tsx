import React, { useState } from 'react';
import styles from './scss/DescriptionBox.module.scss';
import { CardData } from 'types/Nft.interface';
import { Label } from 'components/Text/Text';
import { PurchaseAccordionItem, SingleAccordion } from './SingleAccordion';
import { LargeIcons } from 'components/Icons/MenuIcons';
import { useColorMode } from '@chakra-ui/react';

interface Props {
  data: CardData;
}

export const DescriptionBox: React.FC<Props> = ({ data }: Props) => {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  let description = data.description;

  if (description && description.length > 300) {
    description = `${description.slice(0, 300)}...`;
  }

  const _descriptionSection = description ? <div className={styles.description}>{description}</div> : <div>none</div>;

  return (
    <div className={styles.infoBox}>
      <SingleAccordion>
        <PurchaseAccordionItem dark={dark} title="Description" icon={LargeIcons.starIcon}>
          {_descriptionSection}
        </PurchaseAccordionItem>
      </SingleAccordion>
    </div>
  );
};
