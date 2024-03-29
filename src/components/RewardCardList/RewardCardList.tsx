import React from 'react';
import styles from './RewardCardList.module.scss';
import { AirdropCard, CountdownCard, DataItem, RewardCard } from '../RewardCard/RewardCard';
import { UserReward } from '@infinityxyz/lib/types/core';
import {
  StatsIcon,
  GiftCardIcon,
  MovingIcon,
  PendingIcon,
  StarCircleIcon,
  AnalyticsIcon,
  AwardIcon
} from 'components/Icons/Icons';

type Props = {
  data?: UserReward;
};

export const RewardCardRow = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const activityItems: DataItem[] = [
    { title: 'Sales', value: data.numSales },
    { title: 'Purchases', value: data.numPurchases },
    { title: 'Listings', value: data.numListings },
    { title: 'Offers', value: data.numOffers }
  ];

  const totalRewards: DataItem[] = [
    // { title: 'Rewards Paid', value: data.totalRewardPaid },
    { title: 'Available', value: '600000000', subtitle: '60% of initial supply' }
  ];

  const transactionItems: DataItem[] = [
    { title: 'Sale volume (ETH)', value: data.salesTotalNumeric },
    { title: 'Purchase volume (ETH)', value: data.purchasesTotalNumeric },
    { title: 'Fees (ETH)', value: data.salesFeesTotalNumeric }
  ];

  const expiryTimestamp = new Date(Date.parse('12/07/21'));

  if (data.usPerson === 'YES' || data.usPerson === 'NONE') {
    // user is an U.S. person: show "Not eligible" card
    return (
      <RewardCard
        lines={false}
        items={[{ title: 'Not eligible for Airdrop', value: '' }]}
        title="Not Eligible"
        icon={<GiftCardIcon boxSize={8} />}
      />
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.cardGrid2}>
        <RewardCard lines={false} items={totalRewards} title="$NFT Rewards" icon={<GiftCardIcon boxSize={8} />} />
        <CountdownCard expiryTimestamp={expiryTimestamp} title="Time left" icon={<PendingIcon boxSize={8} />} />
      </div>

      <h3 className={styles.sectionTitle}>
        <div className={styles.icon}>
          <MovingIcon boxSize={8} />
        </div>

        <div>My Stats</div>
      </h3>

      <div className={styles.cardGrid3}>
        <AirdropCard reward={data} />
        <RewardCard items={activityItems} title="Activity" icon={<AnalyticsIcon boxSize={8} />} />
        <RewardCard items={transactionItems} title="Transactions" icon={<StarCircleIcon boxSize={8} />} />
      </div>
    </div>
  );
};
