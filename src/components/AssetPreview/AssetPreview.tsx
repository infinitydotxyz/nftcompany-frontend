import React, { useEffect, useState } from 'react';
import styles from './AssetPreview.module.scss';
import { CardData, BaseCardData } from 'types/Nft.interface';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PurchaseAccordion } from 'components/PurchaseAccordion/PurchaseAccordion';
import { getListings } from 'services/Listings.service';
import { defaultFilterState, ListingSource } from 'utils/context/SearchContext';
import { Spacer, Box } from '@chakra-ui/react';
import { ExtraSpace } from 'components/Spacer/Spacer';
import NFTEvents from 'components/NFTEvents/NFTEvents';
import { getSearchFriendlyString } from 'utils/commonUtil';
import { TraitBox } from 'components/PurchaseAccordion/TraitBox';
import { NftAction } from 'types';
import AppLink from 'components/AppLink/AppLink';
import { useAppContext } from 'utils/context/AppContext';

import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { DescriptionBox } from 'components/PurchaseAccordion/DescriptionBox';

import { Grid, GridItem, Center } from '@chakra-ui/layout';
import { addressesEqual, getChainScannerBase, getToken, toChecksumAddress } from 'utils/commonUtil';

import { Image, Button } from '@chakra-ui/react';
import { Switch, Text, Stack } from '@chakra-ui/react';
import { TraitItem } from 'components/TraitItem';
import { ReadMoreText } from 'components/ReadMoreText/ReadMoreText';

import { ToggleSwitchButton } from 'components/ToggleSwitchButton';

type Props = {
  tokenId: string;
  tokenAddress: string;
  onTitle: (title: string) => void;
};

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
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={[4, 8, 16]} py={[4, 8]}>
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
          <Box ml={-2} mb={[4, 8]}>
            <ToggleSwitchButton />
          </Box>
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
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
              min={100}
              ideal={120}
              max={200}
              readMoreText="Read more"
            />
          </div>
        </GridItem>
      </Grid>

      <Box d="flex" flexWrap="wrap" w="100%" py={[4, 8]}>
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
      <NFTEvents address={tokenAddress} tokenId={tokenId} />
    </div>
  );
};
