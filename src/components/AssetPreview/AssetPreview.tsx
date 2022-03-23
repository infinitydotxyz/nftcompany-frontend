import React, { useEffect, useState } from 'react';
import styles from './AssetPreview.module.scss';
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
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';
import classNames from 'classnames';

type Props = {
  tokenId: string;
  tokenAddress: string;
  onTitle: (title: string) => void;
};

const accountItems: JSX.Element[] = [
  <MenuItem key="Sales">Sales</MenuItem>,
  <MenuDivider key="dd1" />,
  <MenuItem key="Transfer">Transfer</MenuItem>,
  <MenuDivider key="dd2" />,
  <MenuItem key="Offers">Sign out</MenuItem>
];

export const AssetPreview = ({ tokenId, tokenAddress, onTitle }: Props): JSX.Element => {
  const [data, setData] = useState<CardData | undefined>();
  const [listings, setListings] = useState<BaseCardData[]>([]);
  const [title, setTitle] = useState('');
  const { chainId } = useAppContext();

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
    <div className="main">
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={[4, 8, 16]} py={[4, 8]}>
        <GridItem w="100%" bg="white">
          <Center>
            <Image
              alt="not available"
              w={'100%'}
              borderRadius={[6, 12]}
              src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
            />
          </Center>
        </GridItem>
        <GridItem w="100%" bg="white">
          <h3 className={styles.heading}>{data?.collectionName}</h3>
          <Box display={'flex'} gap={4}>
            <AppLink type="secondary" className={styles.collection} href={`${window.origin}/collection/${name}`}>
              {data?.collectionName}
            </AppLink>
            <Box ml={1}>
              <BlueCheckIcon large hasBlueCheck={data.hasBlueCheck === true} />
            </Box>
          </Box>
          <Box my={[4, 8]}>
            <ShortAddress
              address={data.tokenAddress}
              href={`${getChainScannerBase(data.chainId)}/token/${data.tokenAddress}`}
              label="Contract Address:"
              tooltip={toChecksumAddress(data.tokenAddress)}
              className={styles.noMarginTop}
            />
            <ShortAddress
              address={`#${data.tokenId}`}
              href={`${getChainScannerBase(data.chainId)}/token/${data.tokenAddress}?a=${data.tokenId}`}
              label="Token ID:"
              tooltip={`#${data.tokenId}`}
            />
          </Box>
          <Box display={{ base: 'grid', sm: 'flex' }} ml={-1} mb={[4, 8]}>
            <Box
              as="button"
              height="48px"
              lineHeight="1.4"
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              border="1px"
              px="24px"
              borderRadius="24px"
              fontSize="14px"
              fontWeight="semibold"
              bg="#000"
              borderColor="#000"
              color="#fff"
              _hover={{ bg: '#434343' }}
              _active={{
                bg: '#262626',
                transform: 'scale(0.98)'
              }}
              _focus={{
                boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)'
              }}
            >
              Buy&nbsp;&nbsp;&nbsp;3.30 ETH
            </Box>
            <Box
              as="button"
              ml={{ sm: 4 }}
              mt={{ base: 1, sm: 0 }}
              height="48px"
              lineHeight="1.4"
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              border="1px"
              px="36px"
              borderRadius="24px"
              fontSize="14px"
              fontWeight="semibold"
              bg="#fff"
              borderColor="#BEBEBE"
              color="#000"
              _hover={{ bg: '#ebedf0' }}
              _active={{
                bg: '#dddfe2',
                transform: 'scale(0.98)'
              }}
              _focus={{
                boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)'
              }}
            >
              Make offer
            </Box>
          </Box>
          <Text fontWeight={800} mb={[1]}>
            Description
          </Text>
          <div className={styles.description}>
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
        </GridItem>
      </Grid>
      <Text fontWeight={800} mt={[2, 4]} mb={[2, 4]}>
        Traits
      </Text>
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
          <HoverMenuButton buttonTitle={'Filter'} shadow={true} arrow={false} className={styles.filterBtn}>
            {accountItems}
          </HoverMenuButton>
        </Box>
        {[1, 2, 3].map((v) => (
          <Box key={v} className={styles.activity} px={[2, 4, 8]} mx={-1} my={[2, 4]} py={[1, 2, 4, 8]}>
            <div className={styles.activityItem}>
              <p>Seller</p>
              <p>ON1 Force</p>
            </div>
            <div className={styles.activityItem}>
              <p>Buyer</p>
              <p>Nhmen_Howzer</p>
            </div>
            <div className={styles.activityItem}>
              <p>Price</p>
              <p>=2.5</p>
            </div>
            <div className={styles.activityItem}>
              <p>Date</p>
              <p>15 mins ago</p>
            </div>
            <div className={styles.activityItem}>
              <p>Link</p>
              <p>0x0270...f7B3</p>
            </div>
          </Box>
        ))}
      </Box>

      {/* <NFTEvents address={tokenAddress} tokenId={tokenId} /> */}
    </div>
  );
};
