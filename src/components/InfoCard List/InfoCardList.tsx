import React from 'react';
import styles from './InfoCardList.module.scss';
import { CountdownCard, DataItem, InfoCard } from '../InfoCard/InfoCard';
import { UserReward } from 'types/rewardTypes';

type Props = {
  data?: UserReward;
};

export const InfoCardRow = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const listingItems: DataItem[] = [
    { title: 'Listings', value: data.numListings },
    { title: 'Bonus listings', value: data.numBonusListings },
    { title: 'Offers', value: data.numOffers },
    { title: 'Bonus offers', value: data.numBonusOffers }
  ];

  const totalItems: DataItem[] = [
    { title: 'Total sales', value: data.totalSales },
    { title: 'Total volume', value: data.totalVolume },
    { title: 'Total fees', value: data.totalFees }
  ];

  const totalRewards: DataItem[] = [{ title: 'Total Reward Paid', value: data.totalRewardPaid }];

  const rewardItems: DataItem[] = [
    { title: 'Reward', value: data.reward },
    { title: 'Bonus reward', value: data.bonusReward },
    { title: 'Sale reward', value: data.saleReward },
    { title: 'Purchase reward', value: data.purchaseReward },
    { title: 'Gross reward', value: data.grossRewardNumeric?.toString() || '0' },
    { title: 'Net reward', value: data.netRewardNumeric?.toString() || '0' }
  ];

  const blockItems: DataItem[] = [
    { title: 'Current block', value: data.currentBlock },
    { title: 'Reward per block', value: data.rewardPerBlock },
    { title: 'Bonus reward per block', value: data.bonusRewardPerBlock },
    { title: 'Sale reward per block', value: data.saleRewardPerBlock },
    { title: 'Purchase reward per block', value: data.purchaseRewardPerBlock }
  ];

  const salesItems: DataItem[] = [
    { title: 'Sales total', value: data.salesTotalNumeric },
    { title: 'Sales fees total ', value: data.salesFeesTotalNumeric },
    { title: 'Purchases total', value: data.purchasesTotalNumeric },
    { title: 'Purchases fees total', value: data.purchasesFeesTotalNumeric }
  ];

  const notUsed: DataItem[] = [
    { title: 'Total listings', value: data.totalListings },
    { title: 'Total bonus listings', value: data.totalBonusListings },
    { title: 'Total offers', value: data.totalOffers },
    { title: 'Total bonus offers', value: data.totalBonusOffers },
    { title: 'Penalty', value: data.penalty },
    { title: 'Penalty activated', value: data.penaltyActivated },
    { title: 'Penalty ratio', value: data.penaltyRatio }
  ];

  const expiryTimestamp = new Date(Date.parse('10/21/21'));

  return (
    <div className={styles.main}>
      <div className={styles.cardGrid}>
        <InfoCard items={totalItems} title="Totals" />
        <InfoCard items={totalRewards} title="Totals" />

        <CountdownCard expiryTimestamp={expiryTimestamp} title="Time left" />
      </div>

      <h3 className={styles.sectionTitle}>💰 My Rewards</h3>

      <div className={styles.cardGrid}>
        <InfoCard items={rewardItems} title="Rewards" />
        <InfoCard items={listingItems} title="Listing Rewards" />
        <InfoCard items={salesItems} title="Sales / Purchases" />
      </div>

      <h3 className={styles.sectionTitle}>Blockchain</h3>

      <div className={styles.cardGrid}>
        <InfoCard items={blockItems} title="Block" />
        <InfoCard items={notUsed} title="Not used" />
      </div>
    </div>
  );
};
