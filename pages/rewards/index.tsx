import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Rewards.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';
import { RewardResults } from '@infinityxyz/lib/types/core';
import { Spinner } from '@chakra-ui/spinner';
import { DataItem, RewardCard } from 'components/RewardCard/RewardCard';
import { GiftCardIcon } from 'components/Icons/Icons';
import { renderSpinner } from 'utils/commonUtil';

const Rewards = (): JSX.Element => {
  const { user, showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [rewardResults, setRewardResults] = useState<RewardResults | undefined>();

  const fetchRewardResults = async () => {
    if (!user) {
      return;
    }

    setIsFetching(true);
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/reward`);
      if (error) {
        showAppError('Please relogin.');
      } else {
        const res = result as RewardResults;
        setRewardResults(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  React.useEffect(() => {
    fetchRewardResults();
  }, [user]);

  if (isFetching) {
    return (
      <>
        <Head>
          <title>Rewards</title>
        </Head>
        <div className={styles.main}>
          <div className={styles.spinner}>
            <div>{renderSpinner()}</div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return <div />;
  }

  const items = () => {
    if (rewardResults) {
      const activityItems: DataItem[] = [
        { title: 'Eligible Tokens', value: rewardResults.newEligible },
        { title: 'Threshold amount (ETH)', value: rewardResults.newThreshold },
        { title: 'Transacted amount (ETH)', value: rewardResults.transacted },
        {
          title: 'Early supporter bonus',
          value:
            Math.round((rewardResults.finalEarnedTokens / rewardResults.newEligible + Number.EPSILON) * 100) / 100 + 'x'
        },
        { title: 'Total tokens', value: rewardResults.finalEarnedTokens }
      ];
      if (rewardResults.refunded) {
        activityItems.push({ title: 'Claimed refund', value: rewardResults.refunded });
      }
      return activityItems;
    }

    const activityItems: DataItem[] = [
      { title: 'Eligible Tokens', value: 0 },
      { title: 'Threshold amount (ETH)', value: 0 },
      { title: 'Transacted amount (ETH)', value: 0 },
      { title: 'Early supporter bonus', value: 0 },
      { title: 'Total tokens', value: 0 }
    ];

    return activityItems;
  };

  return (
    <>
      <Head>
        <title>Rewards</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <div className={styles.content}>
            <div className={styles.centered}>
              <div className={styles.centerStuff}>
                <div className={styles.stuff}>
                  <div className={styles.title}>The Airdrop has ended</div>
                  <div className={styles.subtitle}>Here are your rewards</div>
                  <RewardCard lines={false} items={items()} title="Rewards" icon={<GiftCardIcon boxSize={8} />} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
Rewards.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Rewards;
