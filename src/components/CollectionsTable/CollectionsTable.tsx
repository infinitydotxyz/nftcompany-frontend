import React from 'react';
import styles from './CollectionsTable.module.scss';
import { Table, Thead, Tbody, Tr, Th, Td, Link } from '@chakra-ui/react';
import { ellipsisAddress, getChainScannerBase, getSearchFriendlyString } from 'utils/commonUtil';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/tooltip';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { CopyButton } from 'components/CopyButton/CopyButton';
import { CollectionCardEntry } from '@infinityxyz/lib/types/core';

type Props = {
  entries?: CollectionCardEntry[];
};

export const CollectionsTable = ({ entries }: Props) => {
  if (!entries) {
    return <div>Nothing found</div>;
  }

  const rows = entries.map((item, index) => {
    const name = getSearchFriendlyString(item.name);

    return (
      <Tr key={item.id}>
        <Td textAlign="center" isNumeric={false}>
          <div className={styles.collectionRow}>
            <div className={styles.leftSpace}>{index + 1}.</div>
            <BlueCheckIcon hasBlueCheck={true} />
            <Link href={`${window.origin}/collection/${name}`}>{item.name}</Link>
          </div>
        </Td>
        <Td textAlign="center" isNumeric={false}>
          <div className={styles.addressRow}>
            <div>{ellipsisAddress(item.id, 10, 10)}</div>
            <CopyButton copyText={item.id} tooltip="Copy Address" />
            <div className={styles.linkIcon}>
              <Tooltip label={'Go to link'} placement="top" hasArrow>
                <ExternalLinkIcon
                  size="sm"
                  color="brandColor"
                  aria-label="Go to link"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id) {
                      window.open(`${getChainScannerBase(item.chainId)}/address/${item.id}`, '_blank');
                    }
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </Td>
      </Tr>
    );
  });

  return (
    <div className={styles.main}>
      <Table colorScheme="gray">
        <Thead>
          <Tr>
            <Th textAlign="center">Collection</Th>
            <Th textAlign="center">Address</Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </div>
  );
};
