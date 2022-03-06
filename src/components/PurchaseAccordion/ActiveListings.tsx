import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import styles from './scss/ActiveListings.module.scss';

import { CardData } from '@infinityxyz/types/core/NftInterface';
import { getChainScannerBase, toChecksumAddress } from 'utils/commonUtil';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';

const MAX_VISIBLE_ITEMS = 10;

interface Props {
  listings: CardData[];
}

export const ActiveListings: React.FC<Props> = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return null;
  }
  return (
    <div>
      <Table size="sm" className={styles.table}>
        <Thead>
          <Tr>
            <Th fontSize="md">Date</Th>
            <Th fontSize="md">Price (ETH)</Th>
            <Th fontSize="md">User</Th>
          </Tr>
        </Thead>
        <Tbody>
          {listings.slice(0, MAX_VISIBLE_ITEMS).map((listing) => {
            return (
              <Tr key={listing.metadata?.createdAt}>
                <Td>{new Date(listing.metadata?.createdAt || '').toLocaleString()}</Td>
                <Td>{listing.price}</Td>
                <Td>
                  <ShortAddress
                    label=""
                    address={listing.maker}
                    href={`${getChainScannerBase(listing?.metadata?.chainId)}/address/${listing.maker}`}
                    tooltip={toChecksumAddress(listing.maker)}
                    className={styles.noMarginTop}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};
