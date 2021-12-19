import React, { useState } from 'react';
import { apiGet } from 'utils/apiUtil';
import { Table, Thead, Tbody, Tr, Th, Td, Link } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { weiToEther } from 'utils/ethersUtil';
import { ellipsisAddress, getChainScannerBase, renderSpinner } from 'utils/commonUtil';
import styles from './CollectionEvents.module.scss';
import { FetchMore } from 'components/FetchMore/FetchMore';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { useAppContext } from 'utils/context/AppContext';

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

  const fetchData = async () => {
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

    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    fetchData();
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
            <Th>
              {activityType === 'sale'
                ? 'Seller/Buyer'
                : activityType === 'offer'
                ? 'Bidder'
                : activityType === 'transfer'
                ? 'From/To'
                : ''}
            </Th>
            <Th>Date</Th>
            {(activityType === 'sale' || activityType === 'offer') && <Th>Price (ETH)</Th>}
            {(activityType === 'sale' || activityType === 'transfer') && <Th>Link</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {isFetching && renderSpinner({ margin: 5 })}

          {data.map((item: any) => {
            return (
              <Tr key={`${address}_${item?.asset?.token_id}_${item.created_date}`}>
                {pageType === 'collection' && (
                  <Td>
                    {item?.asset?.image_thumbnail_url && (
                      <>
                        <img
                          src={`${item.asset.image_thumbnail_url}`}
                          alt={item?.asset?.token_id}
                          className={styles.thumb}
                        />
                        <br />
                        <p>{item?.asset?.name ? item?.asset?.name : item?.asset?.token_id}</p>
                      </>
                    )}
                  </Td>
                )}

                {activityType === 'sale' && (
                  <Td>
                    <Link
                      className={styles.underline}
                      href={`${getChainScannerBase(item?.chainId)}/address/${item?.seller?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.seller?.user?.username || ellipsisAddress(item?.seller?.address)}
                    </Link>
                    {'   '}
                    <ArrowForwardIcon className={styles.arrowPadding} />
                    {'   '}
                    <Link
                      className={styles.underline}
                      href={`${getChainScannerBase(item?.chainId)}/address/${item?.winner_account?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.winner_account?.user?.username || ellipsisAddress(item?.winner_account?.address)}
                    </Link>
                  </Td>
                )}

                {activityType === 'offer' && (
                  <Td>
                    <Link
                      className={styles.underline}
                      href={`${getChainScannerBase(item?.chainId)}/address/${item?.from_account?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.from_account?.user?.username || ellipsisAddress(item?.from_account?.address)}
                    </Link>
                  </Td>
                )}

                {activityType === 'transfer' && (
                  <Td>
                    <Link
                      className={styles.underline}
                      href={`${getChainScannerBase(item?.chainId)}/address/${item?.from_account?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.from_account?.user?.username || ellipsisAddress(item?.from_account?.address)}
                    </Link>{' '}
                    {item?.to_account ? <ArrowForwardIcon /> : ''}{' '}
                    <Link
                      className={styles.underline}
                      href={`${getChainScannerBase(item?.chainId)}/address/${item?.to_account?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.to_account?.user?.username || ellipsisAddress(item?.to_account?.address)}
                    </Link>
                  </Td>
                )}

                <Td>{new Date(item?.created_date).toLocaleString()}</Td>

                {activityType === 'sale' && <Td>{item?.total_price ? weiToEther(item?.total_price) : ''}</Td>}
                {activityType === 'offer' && <Td>{item?.bid_amount ? weiToEther(item?.bid_amount) : ''}</Td>}

                {(activityType === 'sale' || activityType === 'transfer') && (
                  <Td>
                    <Link
                      className={styles.underline}
                      href={`${getChainScannerBase(item?.chainId)}/tx/${item.transaction?.transaction_hash}`}
                      target="_blank"
                    >
                      {ellipsisAddress(item.transaction?.transaction_hash)}
                    </Link>
                  </Td>
                )}
              </Tr>
            );
          })}

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
        </Tbody>
      </Table>
    </div>
  );
}

export default CollectionEvents;
