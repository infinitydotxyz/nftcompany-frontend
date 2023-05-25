import React, { useState } from 'react';
import { useColorMode, Tabs, TabPanels, TabPanel, TabList, Tab } from '@chakra-ui/react';
import { PurchaseAccordionItem, SingleAccordion } from 'components/PurchaseAccordion/SingleAccordion';
import { LargeIcons } from 'components/Icons/MenuIcons';
import CollectionEvents, { EventType } from 'components/CollectionEvents/CollectionEvents';

import styles from './NFTEvents.module.scss';

interface NFTEventsProps {
  address: string;
  tokenId: string;
}

function NFTEvents({ address, tokenId }: NFTEventsProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  return (
    <div className={styles.infoBox}>
      <SingleAccordion>
        <PurchaseAccordionItem dark={dark} title="NFT Activity" icon={LargeIcons.sortIcon}>
          <Tabs onChange={(index) => setTabIndex(index)}>
            <TabList className={styles.tabList}>
              <Tab>Sales</Tab>
              <Tab>Transfers</Tab>
              <Tab>Offers</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {tabIndex === 0 && (
                  <CollectionEvents address={address} tokenId={tokenId} eventType={EventType.Sale} pageType="nft" />
                )}
              </TabPanel>
              <TabPanel>
                {tabIndex === 1 && (
                  <CollectionEvents address={address} tokenId={tokenId} eventType={EventType.Transfer} pageType="nft" />
                )}
              </TabPanel>
              <TabPanel>
                {tabIndex === 2 && (
                  <CollectionEvents address={address} tokenId={tokenId} eventType={EventType.Offer} pageType="nft" />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </PurchaseAccordionItem>
      </SingleAccordion>
    </div>
  );
}

export default NFTEvents;
