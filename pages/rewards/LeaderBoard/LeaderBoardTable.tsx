import React from 'react';
import styles from './LeaderBoardTable.module.scss';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { LeaderBoard, UserReward } from '../types';
import { ellipsisAddress } from 'utils/commonUtil';
import { ethers } from 'ethers';

type Props = {
  data?: LeaderBoard;
};

export const LeaderBoardTable = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const rows = data.results.map((item, index) => {
    const checkSumAddress = ethers.utils.getAddress(item.id);

    return (
      <Tr key={item.id}>
        <Td>#{index + 1}</Td>
        <Td>{ellipsisAddress(checkSumAddress)}</Td>
        <Td isNumeric>{item.numListings}</Td>
        <Td isNumeric>{item.numPurchases}</Td>

        <Td isNumeric>{item.rewardsInfo.netRewardNumeric}</Td>
      </Tr>
    );
  });

  return (
    <div className={styles.main}>
      <Table mt={2} mb={6}>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Address</Th>
            <Th isNumeric>Listings</Th>
            <Th isNumeric>Purchases</Th>
            <Th isNumeric>Rewards</Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </div>
  );
};
