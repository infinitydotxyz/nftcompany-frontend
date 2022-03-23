import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CardData, BaseCardData } from '@infinityxyz/lib/types/core';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { getListings } from 'services/Listings.service';
import { defaultFilterState, ListingSource } from 'utils/context/SearchContext';
import { Image, Text, Box, Button, MenuDivider, MenuItem } from '@chakra-ui/react';
import NFTEvents from 'components/NFTEvents/NFTEvents';
import { getSearchFriendlyString, getChainScannerBase, toChecksumAddress } from 'utils/commonUtil';
import { NftAction } from 'types';
import AppLink from 'components/AppLink/AppLink';
import { useAppContext } from 'utils/context/AppContext';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { Grid, GridItem, Center } from '@chakra-ui/layout';
import { TraitItem } from 'components/TraitItem';
import { ReadMoreText } from 'components/ReadMoreText/ReadMoreText';
import { ToggleSwitchButton } from './components/toggle-switch-button';
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';
import { Page } from 'components/page';
import classNames from 'classnames';

interface AssertDetailProps {
  tokenId: string;
  tokenAddress: string;
  onTitle: (title: string) => void;
}

const accountItems: JSX.Element[] = [
  <MenuItem key="Sales">Sales</MenuItem>,
  <MenuDivider key="dd1" />,
  <MenuItem key="Transfer">Transfer</MenuItem>,
  <MenuDivider key="dd2" />,
  <MenuItem key="Offers">Sign out</MenuItem>
];

export const AssertDetail: React.FC<AssertDetailProps> = ({ tokenId, tokenAddress, onTitle }): JSX.Element => {
  const { chainId } = useAppContext();

  const [data, setData] = useState<CardData | undefined>();
  const [listings, setListings] = useState<BaseCardData[]>([]);
  const [title, setTitle] = useState('');

  const action = NftAction.BuyNft;

  useEffect(() => {
    getCardData();
  }, []);

  const getCardData = async () => {
    const filter = defaultFilterState;

    filter.tokenAddress = tokenAddress;
    filter.tokenId = tokenId;

    const result = await getListings({ ...filter, chainId, listingSource: ListingSource.Infinity });

    if (result && result.length > 0) {
      setListings(result);
      let firstListing = result[0]; // by default, pick the first (latest) listing.
      let createdAt = firstListing.metadata?.createdAt ?? 0;

      // get the latest one if more than 1
      result.forEach((x) => {
        if ((x.metadata?.createdAt ?? 0) > createdAt) {
          firstListing = x;
          createdAt = x.metadata?.createdAt ?? 0;
        }
      });

      setData(firstListing);
      setTitle(firstListing.title);
      onTitle(firstListing.title);
    }
  };

  if (!data) {
    return <div />;
  }

  let name = getSearchFriendlyString(data?.collectionName || '');
  name = name?.toLowerCase();

  return (
    <Page className="max-w-screen-xl mx-auto">
      <div className="mb-4">
        <div className="w-80 mx-auto sm:float-left sm:w-80 md:w-96 lg:w-96 xl:w-128 sm:mr-6 md:mr-8 lg:mr-16 mb-4">
          <img
            alt={`Image - ${data?.title}`}
            className="rounded-3xl w-full"
            src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
          />
        </div>
        <div className="mb-2 md:mb-4 lg:mb-8">
          <ToggleSwitchButton />
        </div>
        <h3 className="text-black font-body text-2xl font-bold leading-9 tracking-wide pb-1">{data?.collectionName}</h3>
        <div className="flex sm:mb-8">
          <Link href={`${window.origin}/collection/${name}`}>
            <a href={`${window.origin}/collection/${name}`} className="text-gray-500 tracking-tight mr-2">
              {data?.collectionName}
            </a>
          </Link>
          <BlueCheckIcon large hasBlueCheck={true} />
        </div>
        <ShortAddress
          address={data.tokenAddress}
          href={`${getChainScannerBase(data.chainId)}/token/${data.tokenAddress}`}
          label="Contract Address:"
          tooltip={toChecksumAddress(data.tokenAddress)}
        />
        <ShortAddress
          address={`#${data.tokenId}`}
          href={`${getChainScannerBase(data.chainId)}/token/${data.tokenAddress}?a=${data.tokenId}`}
          label="Token ID:"
          tooltip={`#${data.tokenId}`}
        />

        <div className="md:flex my-4 lg:my-8">
          <button className="btn btn-dark rounded-3xl md:-ml-2 w-full sm:w-40 mb-1 block">Buy&nbsp;3.30 ETH</button>
          <button className="btn btn-white rounded-3xl md:ml-4 w-full sm:w-40 mb-1">Make offer</button>
        </div>

        <Text fontWeight={800} mb={[1]}>
          Description
        </Text>
        <div>
          <ReadMoreText
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed. "
            min={100}
            ideal={120}
            max={200}
            readMoreText="Read more"
          />
        </div>
      </div>

      <div className="w-full float-left mt-4">
        <Text fontWeight={800} mt={[2, 4]} mb={[2, 4]}>
          Traits
        </Text>
      </div>

      <Box d="flex" flexWrap="wrap" w="100%" pb={[4, 8]} mx={-2}>
        {(data.metadata?.asset?.traits || []).map((item) => {
          return (
            <TraitItem
              key={`${item.traitType}_${item.traitValue}`}
              traitType={item.traitType}
              traitValue={item.traitValue}
              percentage={7}
            />
          );
        })}
      </Box>
      <Box mt={[2, 4]} mb={[2, 8]}>
        <Box display={'flex'} justifyContent="space-between" alignItems="center">
          <Text fontWeight={900}>Activity</Text>
          <HoverMenuButton buttonTitle={'Filter'} shadow={true} arrow={false}>
            {accountItems}
          </HoverMenuButton>
        </Box>
        {[1, 2, 3].map((v) => (
          <Box key={v} px={[2, 4, 8]} mx={-1} my={[2, 4]} py={[1, 2, 4, 8]}>
            <div>
              <p>Seller</p>
              <p>ON1 Force</p>
            </div>
            <div>
              <p>Buyer</p>
              <p>Nhmen_Howzer</p>
            </div>
            <div>
              <p>Price</p>
              <p>=2.5</p>
            </div>
            <div>
              <p>Date</p>
              <p>15 mins ago</p>
            </div>
            <div>
              <p>Link</p>
              <p>0x0270...f7B3</p>
            </div>
          </Box>
        ))}
      </Box>

      {/* <NFTEvents address={tokenAddress} tokenId={tokenId} /> */}
    </Page>
  );
};
