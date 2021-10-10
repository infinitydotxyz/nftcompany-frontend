import React from 'react';
import styles from './CollectionsTable.module.scss';
import { Table, Thead, Tbody, Tr, Th, Td, Link } from '@chakra-ui/react';
import { ellipsisAddress, numStr } from 'utils/commonUtil';
import { CollectionEntry, Collections } from 'types/rewardTypes';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAppContext } from 'utils/context/AppContext';
import { Tooltip } from '@chakra-ui/tooltip';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';

type Props = {
  entries?: CollectionEntry[];
};

export const CollectionsTable = ({ entries }: Props) => {
  const { showAppMessage } = useAppContext();

  if (!entries) {
    return <div>Nothing found</div>;
  }

  const rows = entries.map((item, index) => {
    let name = item.name.replace(/\s/g, '');
    name = name.toLowerCase();

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
            <div className={styles.copyIcon}>
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
              </Tooltip>
            </div>
            <div className={styles.linkIcon}>
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
