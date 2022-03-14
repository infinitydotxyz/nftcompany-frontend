import React, { useState } from 'react';
import styles from './scss/DescriptionBox.module.scss';
import { CardData } from '@infinityxyz/lib/types/core';
import { PurchaseAccordionItem, SingleAccordion } from './SingleAccordion';
import { LargeIcons } from 'components/Icons/MenuIcons';
import { Link, useColorMode } from '@chakra-ui/react';

interface Props {
  data: CardData;
}

export const DescriptionBox: React.FC<Props> = ({ data }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  let description = data.description;
  let showMoreButton = false;

  if (description && description.length > 500) {
    if (!showMore) {
      description = `${description.slice(0, 500)}...`;
    }

    showMoreButton = true;
  }

  const _descriptionSection = description ? <div className={styles.description}>{description}</div> : <div>none</div>;

  return (
    <div className={styles.infoBox}>
      <SingleAccordion>
        <PurchaseAccordionItem dark={dark} title="Description" icon={LargeIcons.listIcon}>
          <>
            {_descriptionSection}

            {showMoreButton && (
              <Link
                onClick={() => {
                  setShowMore(!showMore);
                }}
              >
                <div className={styles.showMore}>{showMore ? 'Read less' : 'Read more'} </div>
              </Link>
            )}
          </>
        </PurchaseAccordionItem>
      </SingleAccordion>
    </div>
  );
};
