import React, { useCallback, useEffect } from 'react';
import { CardData, Order } from 'types/Nft.interface';
import { getOpenSeaportForChain } from 'utils/ethersUtil';
import { useColorMode } from '@chakra-ui/react';
import { PurchaseForm } from './PurchaseForm';
import { MakeOfferForm } from './MakeOfferForm';
import { PreviewInfo } from './PreviewInfo';
import { addressesEqual } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';
import styles from './scss/PurchaseAccordion.module.scss';
import { LargeIcons } from 'components/Icons/MenuIcons';
import { PurchaseAccordionItem, SingleAccordion } from './SingleAccordion';
import { ExtraSpace } from 'components/Spacer/Spacer';
import { NftAction } from 'types';

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

  const loadOrder = useCallback(async () => {
    // card data already has the order, no reason to get it again
    if (data.order) {
      setOrder(data.order);
    } else {
      let orderParams: any;
      const owner = data.owner ?? data.metadata?.asset?.owner;
      if (data.id && data.maker) {
        orderParams = {
          maker: data.maker,
          id: data.id,
          side: 1 // sell order
        };
      } else {
        orderParams = {
          maker: owner,
          tokenId: data.tokenId,
          tokenAddress: data.tokenAddress,
          side: 1 // sell order
        };
      }

      try {
        const seaport = getOpenSeaportForChain(data?.chainId);
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
    case NftAction.CancelListing:
    case NftAction.CancelOffer:
    case NftAction.AcceptOffer:
    case NftAction.ListNft:
    case NftAction.ViewOrder:
      break;
    case NftAction.BuyNft:
    default:
      showPurchase = true;
      const owner = data.owner ?? data.metadata?.asset?.owner;
      if (owner && addressesEqual(owner, user?.account)) {
        showPurchase = false;
      }

      break;
  }

  const dark = colorMode === 'dark';

  return (
    <div className={styles.main}>
      <SingleAccordion>
        <PurchaseAccordionItem dark={dark} title="NFT Information" icon={LargeIcons.imageIcon}>
          <PreviewInfo {...props} />
        </PurchaseAccordionItem>
      </SingleAccordion>

      {showPurchase && order && (
        <>
          <ExtraSpace />

          <SingleAccordion>
            <PurchaseAccordionItem dark={dark} title="Buy Now" icon={LargeIcons.moneyIcon}>
              <PurchaseForm order={order} {...props} />
            </PurchaseAccordionItem>
          </SingleAccordion>

          <ExtraSpace />

          <SingleAccordion>
            <PurchaseAccordionItem dark={dark} title="Make Offer" icon={LargeIcons.offerIcon}>
              <MakeOfferForm order={order} {...props} />
            </PurchaseAccordionItem>
          </SingleAccordion>
        </>
      )}
    </div>
  );
};
