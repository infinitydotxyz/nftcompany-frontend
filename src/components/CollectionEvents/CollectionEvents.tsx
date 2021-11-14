import React from 'react';
import { apiGet } from 'utils/apiUtil';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { weiToEther } from 'utils/ethersUtil';
import { ellipsisAddress } from 'utils/commonUtil';
import styles from './CollectionEvents.module.scss';

interface Props {
  address: string;
  eventType: 'successful' | 'transfer' | 'bid_entered';
}

function CollectionEvents({ address, eventType }: Props) {
  const [events, setEvents] = React.useState([]);

  const fetchData = async () => {
    const { result, error } = await apiGet(
      `https://api.opensea.io/api/v1/events?asset_contract_address=${address}&event_type=${eventType}&only_opensea=false&offset=0&limit=30`,
      {}
    );
    setEvents(result.asset_events);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table>
        <Thead>
          <Tr>
            <Th>Token</Th>
            <Th>Buyer</Th>
            <Th>{eventType === 'successful' ? 'Price' : ''}</Th>
            <Th>Date</Th>
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((item: any) => {
            return (
              <Tr key={`${address}_${item?.asset?.token_id}_${item.created_date}`}>
                <Td>
                  {item?.asset?.image_thumbnail_url && (
                    <img
                      src={`${item.asset.image_thumbnail_url}`}
                      alt={item?.asset?.token_id}
                      className={styles.thumb}
                    />
                  )}
                </Td>
                {eventType === 'successful' && (
                  <Td>
                    <a
                      href={`https://etherscan.io/address/${item?.seller?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.seller?.user?.username || ellipsisAddress(item?.seller?.address)}
                    </a>{' '}
                    🡒{' '}
                    <a
                      href={`https://etherscan.io/address/${item?.winner_account?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.winner_account?.user?.username || ellipsisAddress(item?.winner_account?.address)}
                    </a>
                  </Td>
                )}
                {(eventType === 'transfer' || eventType === 'bid_entered') && (
                  <Td>
                    <a
                      href={`https://etherscan.io/address/${item?.from_account?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.from_account?.user?.username || ellipsisAddress(item?.from_account?.address)}
                    </a>{' '}
                    {item?.to_account ? '🡒 ' : ''}
                    <a
                      href={`https://etherscan.io/address/${item?.to_account?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.to_account?.user?.username || ellipsisAddress(item?.to_account?.address)}
                    </a>
                  </Td>
                )}
                <Td>{item?.total_price ? weiToEther(item?.total_price) : ''}</Td>
                <Td>{new Date(item?.created_date).toLocaleString()}</Td>
                <Td></Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}

export default CollectionEvents;
