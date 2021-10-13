import React, { useCallback, useEffect, useState } from 'react';
import { CardData, Order } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  useColorMode
} from '@chakra-ui/react';
import { PurchaseForm } from './PurchaseForm';
import { MakeOfferForm } from './MakeOfferForm';
import { PreviewInfo } from './PreviewInfo';
import { addressesEqual } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';
import styles from './scss/PurchaseAccordion.module.scss';
import { whiten } from '@chakra-ui/theme-tools';

interface Props {
  data: CardData;
  action: string;
  onComplete: () => void;
}

export const PurchaseAccordion: React.FC<Props> = (props: Props) => {
  const [order, setOrder] = React.useState<Order | undefined>();
  const { data, action } = props;
  const { user } = useAppContext();
  const { colorMode } = useColorMode();
  const [expandedIndex, setExpandedIndex] = useState<number[]>([0, 1, 2]);

  const loadOrder = useCallback(async () => {
    // card data already has the order, no reason to get it again
    if (data.order) {
      setOrder(data.order);
    } else {
      let orderParams: any;

      if (data.id && data.maker) {
        orderParams = {
          maker: data.maker,
          id: data.id,
          side: 1 // sell order
        };
      } else {
        orderParams = {
          maker: data.owner,
          tokenId: data.tokenId,
          tokenAddress: data.tokenAddress,
          side: 1 // sell order
        };
      }

      try {
        const seaport = getOpenSeaport();
        const order: Order = await seaport.api.getOrder(orderParams);

        setOrder(order);
      } catch (err: any) {
        console.log(err);
      }
    }
  }, [data]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  let showPurchase = false;

  switch (action) {
    case 'CANCEL_LISTING':
    case 'CANCEL_OFFER':
    case 'ACCEPT_OFFER':
    case 'LIST_NFT':
    case 'VIEW_ORDER':
      break;
    case 'BUY_NFT':
    default:
      if (data.owner && !addressesEqual(data.owner, user?.account)) {
        showPurchase = true;
      }

      break;
  }

  const dark = colorMode === 'dark';

  // I wish this could go in the scss file, but not sure how
  const expandedStyle = { bg: dark ? 'rgba(255, 255, 255, .41)' : 'rgba(0, 0, 0, .05)' };

  return (
    <div className={styles.main}>
      <Accordion
        defaultIndex={[0, 1]}
        index={expandedIndex}
        allowMultiple
        onChange={(index) => {
          if (Array.isArray(index)) {
            const newIndex = [...index];

            // if (index.includes(1) && index.includes(2)) {
            //   if (expandedIndex.includes(1)) {
            //     newIndex = newIndex.filter((e) => e !== 1);
            //   } else {
            //     newIndex = newIndex.filter((e) => e !== 2);
            //   }
            // }

            setExpandedIndex(newIndex);
          } else {
            setExpandedIndex([index]);
          }
        }}
      >
        <AccordionItem style={{ border: 'none' }}>
          <AccordionButton className={styles.accordionButton} _expanded={expandedStyle}>
            <Box flex="1" textAlign="left">
              NFT Information
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel className={styles.accordionPanel}>
            <PreviewInfo {...props} />
          </AccordionPanel>
        </AccordionItem>

        {showPurchase && order && (
          <>
            <AccordionItem style={{ border: 'none' }}>
              <AccordionButton className={styles.accordionButton} _expanded={expandedStyle}>
                <Box flex="1" textAlign="left">
                  Buy Now
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel className={styles.accordionPanel}>
                <PurchaseForm order={order} {...props} />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem style={{ border: 'none' }}>
              <AccordionButton className={styles.accordionButton} _expanded={expandedStyle}>
                <Box flex="1" textAlign="left">
                  Make Offer
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel className={styles.accordionPanel}>
                <MakeOfferForm order={order} {...props} />
              </AccordionPanel>
            </AccordionItem>
          </>
        )}
      </Accordion>
    </div>
  );
};
