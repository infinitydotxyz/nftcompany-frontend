import React, { useState } from 'react';
import { apiGet } from 'utils/apiUtil';
import { Table, Thead, Tbody, Tr, Th, Td, Link, Box } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { weiToEther } from 'utils/ethersUtil';
import { ellipsisAddress, getChainScannerBase, renderSpinner } from 'utils/commonUtil';
import styles from './CollectionEvents.module.scss';
import { FetchMore } from 'components/FetchMore/FetchMore';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { useAppContext } from 'utils/context/AppContext';
import { EthToken } from 'components/Icons/Icons';

interface Props {
  address: string;
  tokenId?: string;
  eventType: 'successful' | 'transfer' | 'bid_entered';
  activityType: 'sale' | 'transfer' | 'offer';
  pageType: 'nft' | 'collection';
}

function CollectionEvents({ address, tokenId, eventType, activityType, pageType }: Props) {
  const { showAppError } = useAppContext();
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);

  const fetchData = async (isActiveWrapper?: { isActive: boolean }) => {
    setIsFetching(true);
    const newCurrentPage = currentPage + 1;
    const offset = newCurrentPage * ITEMS_PER_PAGE;
    const tokenIdParam = tokenId ? `&token_id=${tokenId}` : '';
    const addressLowerCase = address.trim().toLowerCase();
    const { result, error } = await apiGet(
      `/events?asset_contract_address=${addressLowerCase}${tokenIdParam}&event_type=${eventType}&only_opensea=false&offset=${offset}&limit=${ITEMS_PER_PAGE}`
    );
    if (error) {
      showAppError(`Error when fetching data. ${error.message}`);
    }

    const moreData = result?.asset_events || [];

    if (isActiveWrapper && !isActiveWrapper.isActive) {
      return;
    }
    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    const isActiveWrapper = { isActive: true };
    fetchData(isActiveWrapper);
    return () => {
      isActiveWrapper.isActive = false;
    };
  }, []);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  return (
    <div>
      <Table>
        <Thead>
          <Tr>
            {pageType === 'collection' && <Th style={{ width: '20%' }}>Token</Th>}
            <Th>From</Th>
            <Th>To</Th>
            <Th minWidth={'150px'}>Date</Th>
            <Th>Price (ETH)</Th>
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: any) => {
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
                    href={`${getChainScannerBase(item?.chainId)}/address/${item?.seller?.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.seller?.user?.username || ellipsisAddress(item?.seller?.address)}
                  </Link>
                </Td>

                <Td>
                  <Link
                    className={styles.underline}
                    href={`${getChainScannerBase(item?.chainId)}/address/${item?.winner_account?.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.winner_account?.user?.username || ellipsisAddress(item?.winner_account?.address)}
                  </Link>
                </Td>
                <Td>
                  <p>{`${new Date(item?.created_date).toLocaleDateString()}`}</p>

                  <p>{new Date(item?.created_date).toLocaleTimeString()}</p>
                </Td>

                {activityType === 'sale' && (
                  <Td>
                    {item?.total_price ? (
                      <>
                        <EthToken marginBottom="6px" /> {weiToEther(item?.total_price)}
                      </>
                    ) : (
                      '---'
                    )}
                  </Td>
                )}
                {activityType === 'offer' && (
                  <Td>
                    {item?.bid_amount ? (
                      <>
                        <EthToken marginBottom="6px" /> {weiToEther(item?.bid_amount)}{' '}
                      </>
                    ) : (
                      '---'
                    )}
                  </Td>
                )}
                {activityType !== 'sale' && activityType !== 'offer' && <Td>{'---'}</Td>}

                <Td>
                  {activityType === 'sale' || activityType === 'transfer' ? (
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
    </div>
  );
}

export default CollectionEvents;
