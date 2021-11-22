import React from 'react';
import styles from './LeaderBoardTable.module.scss';
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Icon } from '@chakra-ui/react';
import { ellipsisAddress, numStr } from 'utils/commonUtil';
import { LeaderBoard, LeaderBoardEntry } from 'types/rewardTypes';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/tooltip';
import { CopyButton } from 'components/CopyButton/CopyButton';
import { CHAIN_SCANNER_BASE } from 'utils/constants';

type Props = {
  data?: LeaderBoard;
};

const getRows = (data: LeaderBoardEntry[]) => {
  return data.map((item, index) => {
    return (
      <Tr key={item.id}>
        <Td textAlign="center" isNumeric={false}>
          #{index + 1}
        </Td>
        <Td textAlign="center" isNumeric={false}>
          <div className={styles.addressRow}>
            <div>{ellipsisAddress(item.id, 10, 10)}</div>

            <CopyButton copyText={item.id} tooltip="Copy Address" />

            <i className={styles.linkIcon}>
              <Tooltip label={'Go to Etherscan'} placement="top" hasArrow>
                <ExternalLinkIcon
                  size="sm"
                  color="brandBlue"
                  aria-label="Go to link"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id) {
                      window.open(`${CHAIN_SCANNER_BASE}/address/${item.id}`, '_blank');
                    }
                  }}
                />
              </Tooltip>{' '}
            </i>
          </div>
        </Td>

        <Td textAlign="center" isNumeric={false}>
          {numStr(item.total)}
        </Td>
      </Tr>
    );
  });
};

export const SaleLeaderBoardTable = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const saleRows = getRows(data.results.saleLeaders);

  return (
    <div className={styles.main}>
      <Table colorScheme="gray">
        <Thead>
          <Tr>
            <Th textAlign="center">Rank</Th>
            <Th textAlign="center">Address</Th>
            <Th textAlign="center">Sale Volume (ETH)</Th>
          </Tr>
        </Thead>
        <Tbody>{saleRows}</Tbody>
      </Table>
    </div>
  );
};

export const BuyLeaderBoardTable = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const buyRows = getRows(data.results.buyLeaders);

  return (
    <div className={styles.main}>
      <Table colorScheme="gray">
        <Thead>
          <Tr>
            <Th textAlign="center">Rank</Th>
            <Th textAlign="center">Address</Th>
            <Th textAlign="center">Buy Volume (ETH)</Th>
          </Tr>
        </Thead>
        <Tbody>{buyRows}</Tbody>
      </Table>
    </div>
  );
};
