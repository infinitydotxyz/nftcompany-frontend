import React from 'react';
import { InView } from 'react-intersection-observer';
import { Box } from '@chakra-ui/layout';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { CardData } from '@infinityxyz/types/core';

type FetchMoreElementProps = {
  inView: boolean;
  ref?: React.LegacyRef<HTMLSpanElement>;
  onFetchMore: () => void;
  data?: any[];
  currentPage?: number;
};

const FetchMoreElement = ({ inView, ref, onFetchMore, data, currentPage }: FetchMoreElementProps) => {
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      if (currentPage === 0 && data && data?.length < ITEMS_PER_PAGE) {
        return; // return if it's the first page with less items.
      }
      onFetchMore();
    }
  }, [inView]);
  return <span ref={ref}>&nbsp;</span>; // render a placeholder to check if it's visible (inView) or not.
};

type FetchMoreProps = {
  onFetchMore: () => void;
  data?: any[];
  currentPage?: number;
};

export const FetchMore = ({ onFetchMore, data, currentPage }: FetchMoreProps) => {
  return (
    <InView>
      {({ inView, ref }) => {
        return (
          <div ref={ref}>
            <FetchMoreElement inView={inView} onFetchMore={onFetchMore} data={data} currentPage={currentPage} />
          </div>
        );
      }}
    </InView>
  );
};

export const getLastItemSearchTitle = (data: CardData[]): string =>
  data?.length > 0 ? data[data.length - 1]?.metadata?.asset?.searchTitle ?? '' : '';

export const getLastItemSearchCollectionName = (data: CardData[]): string =>
  data?.length > 0 ? data[data.length - 1]?.metadata?.asset?.searchCollectionName ?? '' : '';

export const getLastItemMaker = (data: CardData[]): string =>
  data?.length > 0 ? data[data.length - 1]?.maker ?? '' : '';

export const getLastItemCreatedAt = (data: CardData[]): string =>
  data?.length > 0 ? data[data.length - 1]?.metadata?.createdAt?.toString() ?? '' : '';

export const getLastItemBasePrice = (data: CardData[]): string =>
  data?.length > 0 ? data[data.length - 1]?.metadata?.basePriceInEth?.toString() ?? '' : '';

export const getLastItemBlueCheck = (data: CardData[]): boolean =>
  data?.length > 0 ? data[data.length - 1]?.metadata?.hasBlueCheck ?? false : false;

export const NoData = ({
  isFetching,
  data,
  dataLoaded
}: {
  isFetching: boolean;
  data: any[];
  dataLoaded?: boolean;
}) => {
  if (dataLoaded && !isFetching && data?.length === 0) {
    return <Box mt={10}>Nothing to show.</Box>;
  }
  return null;
};

export const PleaseConnectWallet = ({ account }: { account: string | undefined }) => {
  if (account) {
    return null;
  }
  return <Box mt={4}>Please connect to your MetaMask wallet.</Box>;
};
