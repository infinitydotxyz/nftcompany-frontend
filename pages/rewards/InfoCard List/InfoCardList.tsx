import React from 'react';
import styles from './InfoCardList.module.scss';
import { UserReward } from '../types';
import { DataItem, InfoCard } from '../InfoCard/InfoCard';

type Props = {
  data?: UserReward;
};

export const InfoCardRow = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const listingItems: DataItem[] = [
    { title: 'Listings', value: data.numListings },
    { title: 'Bonus Listings', value: data.numBonusListings },
    { title: 'Offers', value: data.numOffers },
    { title: 'Bonus Offers', value: data.numBonusOffers }
  ];

  const totalItems: DataItem[] = [
    { title: 'Total Listings', value: data.totalListings },
    { title: 'Total Bonus Listings', value: data.totalBonusListings },
    { title: 'Total Offers', value: data.totalOffers },
    { title: 'Total Bonus Offers', value: data.totalBonusOffers },
    // { title: 'purchases Total', value: data.purchasesTotal },
    // { title: 'purchases Fees Total', value: data.purchasesFeesTotal },
    { title: 'Purchases Total', value: data.purchasesTotalNumeric },
    { title: 'Purchases Fees Total', value: data.purchasesFeesTotalNumeric },
    { title: 'Total Sales', value: data.totalSales },
    { title: 'Total Volume', value: data.totalVolume },
    { title: 'Total Fees', value: data.totalFees }
  ];

  const rewardItems: DataItem[] = [
    { title: 'Reward', value: data.reward },
    { title: 'Bonus Reward', value: data.bonusReward },
    { title: 'Sale Reward', value: data.saleReward },
    { title: 'Purchase Reward', value: data.purchaseReward },
    // { title: 'Gross Reward', value: data.grossReward },
    // { title: 'Net Reward', value: data.netReward },
    { title: 'Gross Reward', value: data.grossRewardNumeric?.toString() || '0' },
    { title: 'Net Reward', value: data.netRewardNumeric?.toString() || '0' },
    { title: 'penalty', value: data.penalty },
    { title: 'penaltyActivated', value: data.penaltyActivated },
    { title: 'penaltyRatio', value: data.penaltyRatio }
  ];

  const blockItems: DataItem[] = [
    { title: 'currentBlock', value: data.currentBlock },
    { title: 'rewardPerBlock', value: data.rewardPerBlock },
    { title: 'bonusRewardPerBlock', value: data.bonusRewardPerBlock },
    { title: 'saleRewardPerBlock', value: data.saleRewardPerBlock },
    { title: 'purchaseRewardPerBlock', value: data.purchaseRewardPerBlock }
  ];

  const salesItems: DataItem[] = [
    // { title: 'salesTotal', value: data.salesTotal },
    // { title: 'salesFeesTotal', value: data.salesFeesTotal },
    { title: 'Sales Total', value: data.salesTotalNumeric },
    { title: 'Sales Fees Total ', value: data.salesFeesTotalNumeric }
  ];

  return (
    <div className={styles.main}>
      <h3 className={styles.sectionTitle}>My Rewards 💰</h3>

      <div className={styles.cardGrid}>
        <InfoCard items={listingItems} title="Listing Rewards" />
        <InfoCard items={rewardItems} title="Rewards" />
      </div>

      <h3 className={styles.sectionTitle}>Totals 💰</h3>
      <div className={styles.cardGrid}>
        <InfoCard items={salesItems} title="Sales" />
        <InfoCard items={totalItems} title="Totals" />
        <InfoCard items={blockItems} title="Block" />
      </div>
    </div>
  );
};
