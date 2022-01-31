import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Link, Box, Text, Checkbox, ChakraProps, Image } from '@chakra-ui/react';
import styles from './scss/PriceHistory.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';

interface ListingHistoryItem {
  listingDate: string;
  price: number;
}

interface Props {}

export const PriceHistory: React.FC<Props> = () => {
  const { showAppError } = useAppContext();
  const [data, setData] = useState<ListingHistoryItem[]>([]);

  // TODO: integrate with BE endpoint:
  const fetchData = async () => {
    const { result, error } = await apiGet(`/events`, {});
    // if (error) {
    //   showAppError(`Error when fetching data. ${error.message}`);
    //   return;
    // }
    const arr: ListingHistoryItem[] = [
      {
        listingDate: '01/20/2022 13:30',
        price: 1.9
      },
      {
        listingDate: '01/30/2022 15:30',
        price: 2.5
      }
    ];
    setData(arr);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table size="sm" className={styles.table}>
        <Thead>
          <Tr>
            <Th fontSize="md">Date</Th>
            <Th fontSize="md">Price (ETH)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => {
            return (
              <Tr key={item.listingDate}>
                <Td>{item.listingDate}</Td>
                <Td>{item.price}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};
