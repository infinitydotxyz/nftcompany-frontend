import React from 'react';
import styles from './RewardCardList.module.scss';
import { CountdownCard, DataItem, RewardCard } from '../RewardCard/RewardCard';
import { UserReward } from 'types/rewardTypes';

type Props = {
  data?: UserReward;
};

export const RewardCardRow = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  const listingItems: DataItem[] = [
    { title: 'Sales', value: data.numSales },
    { title: 'Purchases', value: data.numPurchases },
    { title: 'Listings', value: data.numListings },
    { title: 'Bonus listings', value: data.numBonusListings },
    { title: 'Offers', value: data.numOffers },
    { title: 'Bonus offers', value: data.numBonusOffers }
  ];

  const totalItems: DataItem[] = [
    { title: 'Volume', value: data.totalVolume },
    { title: 'Fees', value: data.totalFees }
  ];

  const totalRewards: DataItem[] = [
    { title: 'Rewards Paid', value: data.totalRewardPaid },
    { title: 'out of', value: '2000000000' }
  ];

  const rewardItems: DataItem[] = [
    { title: 'Gross', value: data.grossRewardNumeric?.toString() || '0' },
    { title: 'Net', value: data.netRewardNumeric?.toString() || '0' }
  ];

  const blockItems: DataItem[] = [
    { title: 'Current block', value: data.currentBlock },
    { title: 'Reward per block', value: data.rewardPerBlock },
    { title: 'Bonus reward per block', value: data.bonusRewardPerBlock },
    { title: 'Sale reward per block', value: data.saleRewardPerBlock },
    { title: 'Purchase reward per block', value: data.purchaseRewardPerBlock }
  ];

  const salesItems: DataItem[] = [
    { title: 'Total sales amount', value: data.salesTotalNumeric },
    { title: 'Total purchases amount ', value: data.purchasesTotalNumeric },
    { title: 'Total fees', value: data.salesFeesTotalNumeric + data.purchasesFeesTotalNumeric }
  ];

  const notUsed: DataItem[] = [
    { title: 'Reward', value: data.reward },
    { title: 'Bonus reward', value: data.bonusReward },
    { title: 'Sale reward', value: data.saleReward },
    { title: 'Purchase reward', value: data.purchaseReward },
    { title: 'Total sales', value: data.totalSales },
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
      <div className={styles.cardGrid3}>
        <RewardCard lines={false} items={totalItems} title="Stats" />
        <RewardCard lines={false} items={totalRewards} title="NFTS Rewards" />
        <CountdownCard expiryTimestamp={expiryTimestamp} title="Time left" />
      </div>

      <h3 className={styles.sectionTitle}>My Stats</h3>

      <div className={styles.cardGrid3}>
        <RewardCard items={rewardItems} title="Rewards" />
        <RewardCard items={listingItems} title="Stats" />
        <RewardCard items={salesItems} title="Sales / Purchases" />
      </div>

      {/* <h3 className={styles.sectionTitle}>Blockchain</h3>

      <div className={styles.cardGrid1}>
        <RewardCard items={blockItems} title="Block" />
      </div> */}
    </div>
  );
};
