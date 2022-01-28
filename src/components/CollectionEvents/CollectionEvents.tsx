import React, { useState } from 'react';
import { apiGet } from 'utils/apiUtil';
import { Table, Thead, Tbody, Tr, Th, Td, Link, Box, Text, Checkbox, ChakraProps } from '@chakra-ui/react';
import { weiToEther } from 'utils/ethersUtil';
import { ellipsisAddress, getChainScannerBase, numStr, renderSpinner } from 'utils/commonUtil';
import styles from './CollectionEvents.module.scss';
import { FetchMore } from 'components/FetchMore/FetchMore';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { useAppContext } from 'utils/context/AppContext';
import { EthToken } from 'components/Icons/Icons';

export enum EventType {
  Sale = 'successful',
  Transfer = 'transfer',
  Offer = 'bid_entered'
}
interface Props {
  address: string;
  tokenId?: string;
  pageType: 'nft' | 'collection';
  eventType: EventType;
}

function CollectionEvents({ address, tokenId, eventType, pageType, ...rest }: Props & ChakraProps) {
  const { showAppError, chainId, userReady } = useAppContext();
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);

  const fetchData = async (isActiveWrapper?: { isActive: boolean }, reset?: boolean) => {
    setIsFetching(true);
    const newCurrentPage = reset ? 0 : currentPage + 1;
    const offset = newCurrentPage * ITEMS_PER_PAGE;
    const addressLowerCase = address.trim().toLowerCase();

    const { result, error } = await apiGet(`/events`, {
      assetContractAddress: addressLowerCase,
      tokenId: tokenId ?? '',
      eventType: eventType,
      offset: offset,
      limit: ITEMS_PER_PAGE,
      chainId: chainId
    });
    if (error) {
      showAppError(`Error when fetching data. ${error.message}`);
    }

    const moreData = result?.asset_events || [];

    if (isActiveWrapper && !isActiveWrapper.isActive) {
      return;
    }
    setIsFetching(false);
    const prevData = reset ? [] : data;
    setData([...prevData, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    const isActiveWrapper = { isActive: true };
    setData([]);
    setCurrentPage(-1);
    if (!userReady) {
      return;
    }
    fetchData(isActiveWrapper, true);
    return () => {
      isActiveWrapper.isActive = false;
    };
  }, [eventType, userReady]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  return (
    <Box display="flex" flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'} {...rest}>
      <Table size="sm">
        <Thead>
          <Tr>
            {pageType === 'collection' && (
              <Th fontSize="md" style={{ width: '20%' }}>
                Token
              </Th>
            )}
            <Th fontSize="md">From</Th>
            <Th fontSize="md">To</Th>
            <Th fontSize="md" minWidth={'150px'}>
              Date
            </Th>
            <Th fontSize="md">Price (ETH)</Th>
            <Th fontSize="md">Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: any) => {
            const from = item?.seller?.user?.username || item?.from_account?.user?.username;
            const fromAddress = item?.seller?.address || item?.from_account?.address;
            const to = item?.winner_account?.user?.username ?? item?.to_account?.user?.username;
            const toAddress = item?.winner_account?.address || item?.to_account?.address;
            return (
              <Tr key={`${address}_${item?.asset?.token_id}_${item.created_date}`}>
                {pageType === 'collection' && (
                  <Td display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
                    {item?.asset?.image_thumbnail_url && (
                      <>
                        <img
                          src={`${item.asset.image_thumbnail_url}`}
                          alt={item?.asset?.token_id}
                          className={styles.thumb}
                        />
                        <br />
                        <p className={styles.tokenName}>
                          {item?.asset?.name ? item?.asset?.name : item?.asset?.token_id}
                        </p>
                      </>
                    )}
                  </Td>
                )}
                <Td>
                  <Link
                    className={styles.underline}
                    href={`${getChainScannerBase(item?.chainId)}/address/${fromAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {from || ellipsisAddress(fromAddress)}
                  </Link>
                </Td>

                <Td>
                  <Link
                    className={styles.underline}
                    href={`${getChainScannerBase(item?.chainId)}/address/${toAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {to || ellipsisAddress(toAddress)}
                  </Link>
                </Td>
                <Td>
                  <p>{`${new Date(item?.created_date).toLocaleDateString()}`}</p>

                  <p>{new Date(item?.created_date).toLocaleTimeString()}</p>
                </Td>

                {item?.event_type === EventType.Sale && (
                  <Td>
                    {item?.total_price ? (
                      <Box display="flex" flexDirection={'row'} alignItems="center">
                        <EthToken marginBottom={'-2px'} /> {numStr(weiToEther(item?.total_price))}{' '}
                      </Box>
                    ) : (
                      '---'
                    )}
                  </Td>
                )}
                {item.event_type === EventType.Offer && (
                  <Td>
                    {item?.bid_amount ? (
                      <Box display="flex" flexDirection={'row'} alignItems="center">
                        <EthToken marginBottom={'-2px'} /> {numStr(weiToEther(item?.bid_amount))}{' '}
                      </Box>
                    ) : (
                      '---'
                    )}
                  </Td>
                )}
                {item.event_type !== EventType.Sale && item.event_type !== EventType.Offer && <Td>{'---'}</Td>}

                <Td>
                  {item.event_type === EventType.Sale || item.event_type === EventType.Transfer ? (
                    <Link
                      className={styles.underline}
                      href={`${getChainScannerBase(item?.chainId)}/tx/${item.transaction?.transaction_hash}`}
                      target="_blank"
                    >
                      {ellipsisAddress(item.transaction?.transaction_hash)}
                    </Link>
                  ) : (
                    '---'
                  )}
                </Td>
              </Tr>
            );
          })}

          {dataLoaded && !isFetching && data.length === 0 && <Box p={6}>No data.</Box>}
        </Tbody>
      </Table>

      {isFetching && renderSpinner({ margin: 5 })}
      {dataLoaded && (
        <FetchMore
          currentPage={currentPage}
          data={data}
          onFetchMore={async () => {
            setDataLoaded(false);
            await fetchData();
          }}
        />
      )}
    </Box>
  );
}

export default CollectionEvents;
