import React from 'react';
import styles from './TransactionsTable.module.scss';
import { Table, Thead, Tbody, Tr, Th, Td, Link } from '@chakra-ui/react';
import { ellipsisAddress, getChainScannerBase } from 'utils/commonUtil';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/tooltip';
import { CopyButton } from 'components/CopyButton/CopyButton';
import { TransactionCardEntry } from '@infinityxyz/lib/types/core';

type Props = {
  entries?: TransactionCardEntry[];
};

export const TransactionsTable = ({ entries }: Props) => {
  if (!entries) {
    return <div>Nothing found</div>;
  }

  const rows = entries.map((item, index) => {
    return (
      <Tr key={item.txnHash}>
        <Td textAlign="center" isNumeric={false}>
          {`${new Date(item.createdAt).toLocaleString()}`}
        </Td>
        <Td textAlign="center" isNumeric={false}>
          <div className={styles.addressRow}>
            <div>{ellipsisAddress(item.txnHash, 10, 10)}</div>
            <CopyButton copyText={item.txnHash} tooltip="Copy Txn Hash" />
            <div className={styles.linkIcon}>
              <Tooltip label={'Go to link'} placement="top" hasArrow>
                <ExternalLinkIcon
                  size="sm"
                  color="brandColor"
                  aria-label="Go to link"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.txnHash) {
                      window.open(`${getChainScannerBase(item.chainId)}/tx/${item.txnHash}`, '_blank');
                    }
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </Td>

        <Td textAlign="center" isNumeric={false}>
          {item.actionType}
        </Td>

        <Td textAlign="center" isNumeric={false}>
          {item.status}
        </Td>
      </Tr>
    );
  });

  return (
    <div className={styles.main}>
      <Table colorScheme="gray">
        <Thead>
          <Tr>
            <Th textAlign="center">Time</Th>
            <Th textAlign="center">Txn Hash</Th>
            <Th textAlign="center">Action</Th>
            <Th textAlign="center">Status</Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </div>
  );
};
