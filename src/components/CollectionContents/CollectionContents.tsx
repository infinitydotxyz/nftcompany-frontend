import { useCardProvider } from 'hooks/useCardProvider';
import React, { useEffect } from 'react';
import { useAppContext } from 'utils/context/AppContext';
import { ListingSource, useSearchContext } from 'utils/context/SearchContext';
import { NoData } from 'components/FetchMore/FetchMore';
import CardList from 'components/Card/CardList';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { NftAction } from 'types';

type Props = {
  name: string;
  onTitle: (title: string) => void;
  onLoaded?: ({ address }: { address: string }) => void;
  listingSource: ListingSource;
  address?: string;
};

export default function CollectionContents({ name, onTitle, onLoaded, listingSource, address }: Props): JSX.Element {
  const searchContext = useSearchContext();
  const cardProvider = useCardProvider(listingSource, searchContext, name as string);
  const { user } = useAppContext();

  useEffect(() => {
    searchContext.setFilterState({ ...searchContext.filterState, tokenAddress: address ?? '' });
  }, [address]);

  useEffect(() => {
    if (cardProvider.hasLoaded) {
      if (cardProvider.list.length > 0) {
        const title = cardProvider.list[0].collectionName;
        const tokenAddress = cardProvider.list[0].tokenAddress || address || '';
        if (onLoaded) {
          onLoaded({ address: tokenAddress });
        }
        if (title) {
          onTitle(title);
        }
      }
    }
  }, [cardProvider]);

  return (
    <>
      <NoData dataLoaded={cardProvider.hasLoaded} isFetching={!cardProvider.hasLoaded} data={cardProvider.list} />

      {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}

      <CardList showItems={['PRICE']} userAccount={user?.account} data={cardProvider.list} action={NftAction.BuyNft} />

      {cardProvider.hasData() && (
        <ScrollLoader
          onFetchMore={async () => {
            cardProvider.loadNext();
          }}
        />
      )}
    </>
  );
}
