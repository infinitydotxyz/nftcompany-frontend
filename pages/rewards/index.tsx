import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Rewards.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';
import { UnderConstructionIcon } from 'components/Icons/Icons';
import { LeaderBoard, UserReward } from './types';
import { LeaderBoardTable } from './LeaderBoard/LeaderBoardTable';
import { InfoCardRow } from './InfoCard List/InfoCardList';

const Rewards = (): JSX.Element => {
  const { user } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [userReward, setUserReward] = useState<UserReward | undefined>();
  const [leaderboard, setLeaderBoard] = useState<LeaderBoard | undefined>();

  // SNG disabled for now
  const disabled: boolean = false;

  const fetchUserReward = async () => {
    if (!user) {
      return;
    }

    setIsFetching(true);
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/reward`);

      setUserReward(result);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLeaderboard = async () => {
    setIsFetching(true);
    try {
      const { result, error } = await apiGet(`/rewards/leaderboard`);

      setLeaderBoard(result);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchUserReward();
  }, [user]);

  React.useEffect(() => {
    fetchLeaderboard();
  }, []);

  // const numListingsPct = data?.totalListings > 0 ? data?.numListings / data?.totalListings : 0;
  // const numBonusListingsPct = data?.totalBonusListings > 0 ? data?.numBonusListings / data?.totalBonusListings : 0;
  // const feesPaidPct = data?.totalFees > 0 ? data?.feesPaid / data?.totalFees : 0;

  if (disabled) {
    return (
      <>
        <Head>
          <title>Rewards</title>
        </Head>
        <div className={styles.main}>
          <div className="page-container">
            <div className="section-bar">
              <div className="tg-title">Rewards</div>
            </div>

            <div className={styles.comingSoon}>
              <div style={{ color: '#ddd' }}>
                <UnderConstructionIcon />
              </div>
              <div>Coming Soon...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function float2dollar(value: number) {
    return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  }

  function formatXAxesLabelText(label: string) {
    if (/\s/.test(label)) {
      return label.split(' ');
    }

    return label;
  }

  return (
    <>
      <Head>
        <title>Rewards</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Rewards</div>
          </div>

          <div>
            <InfoCardRow data={userReward} />

            <div className={styles.leaderBox}>
              <h3 className={styles.sectionTitle}>Leaderboard 🏆</h3>
              <LeaderBoardTable data={leaderboard} />
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
