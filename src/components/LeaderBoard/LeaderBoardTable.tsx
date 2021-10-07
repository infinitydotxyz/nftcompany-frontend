import React from 'react';
import styles from './LeaderBoardTable.module.scss';
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Icon } from '@chakra-ui/react';
import { ellipsisAddress, numStr } from 'utils/commonUtil';
import { LeaderBoard } from 'types/rewardTypes';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAppContext } from 'utils/context/AppContext';
import { Tooltip } from '@chakra-ui/tooltip';

type Props = {
  data?: LeaderBoard;
};

export const LeaderBoardTable = ({ data }: Props) => {
  const { user, showAppError, showAppMessage } = useAppContext();

  if (!data) {
    return <div>Nothing found</div>;
  }

  const rows = data.results.map((item, index) => {
    return (
      <Tr key={item.id}>
        <Td textAlign="center" isNumeric={false}>
          #{index + 1}
        </Td>
        <Td textAlign="center" isNumeric={false}>
          <div className={styles.addressRow}>
            <div>{ellipsisAddress(item.id, 10, 10)}</div>
            <i className={styles.copyIcon}>
              <Tooltip label={'Copy Address'} placement="top" hasArrow>
                <CopyIcon
                  size="sm"
                  color="blue"
                  aria-label="Copy"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id) {
                      navigator.clipboard.writeText(item.id);
                      showAppMessage(`Copied to Clipboard.`);
                    }
                  }}
                />
              </Tooltip>{' '}
            </i>
            <i className={styles.linkIcon}>
              <Tooltip label={'Go to Etherscan'} placement="top" hasArrow>
                <ExternalLinkIcon
                  size="sm"
                  color="blue"
                  aria-label="Go to link"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id) {
                      window.open(`https://etherscan.io/address/${item.id}`, '_blank');
                    }
                  }}
                />
              </Tooltip>{' '}
            </i>
          </div>
        </Td>

        <Td textAlign="center" isNumeric={false}>
          {item.total}
        </Td>
      </Tr>
    );
  });

  return (
    <div className={styles.main}>
      <Table colorScheme="gray">
        <Thead>
          <Tr>
            <Th textAlign="center">Rank</Th>
            <Th textAlign="center">Address</Th>
            <Th textAlign="center">Volume (ETH)</Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </div>
  );
};
