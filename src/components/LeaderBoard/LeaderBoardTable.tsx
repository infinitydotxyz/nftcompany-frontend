import React from 'react';
import styles from './LeaderBoardTable.module.scss';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { ellipsisAddress, numStr } from 'utils/commonUtil';
import { ethers } from 'ethers';
import { LeaderBoard } from 'types/rewardTypes';

type Props = {
  data?: LeaderBoard;
};

export const LeaderBoardTable = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const rows = data.results.map((item, index) => {
    return (
      <Tr key={item.id}>
        <Td>#{index + 1}</Td>
        <Td>{ellipsisAddress(item.id)}</Td>
        <Td>{numStr(item.numListings)}</Td>
        <Td>{numStr(item.numPurchases)}</Td>

        <Td>{numStr(item.rewardsInfo.netRewardNumeric)}</Td>
      </Tr>
    );
  });

  return (
    <div className={styles.main}>
      <Table colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Address</Th>
            <Th>Listings</Th>
            <Th>Purchases</Th>
            <Th>Rewards</Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </div>
  );
};
