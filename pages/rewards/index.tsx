import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Rewards.module.scss';
import sharedStyles from '/styles/SharedStyles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';
import { LeaderBoard, UserReward } from '../../src/types/rewardTypes';
import { Spinner } from '@chakra-ui/spinner';
import { RewardCardRow } from 'components/RewardCardList/RewardCardList';
import { LeaderBoardTable } from 'components/LeaderBoard/LeaderBoardTable';

const Rewards = (): JSX.Element => {
  const { user } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [userReward, setUserReward] = useState<UserReward | undefined>();
  const [leaderboard, setLeaderBoard] = useState<LeaderBoard | undefined>();

  const fetchUserReward = async () => {
    if (!user) {
      return;
    }

    setIsFetching(true);
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/reward`);

      setUserReward(result);

      // console.log(JSON.stringify(result, null, '  '));
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { result, error } = await apiGet(`/rewards/leaderboard`);

      setLeaderBoard(result);

      // console.log(JSON.stringify(result, null, '  '));
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

  if (isFetching) {
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
          </div>
          <div className={styles.spinner}>
            <div>
              <Spinner color="brandBlue" thickness="8px" height={100} width={100} emptyColor="gray.200" speed=".8s" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return <div />;
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
            <RewardCardRow data={userReward} />
            <div className={styles.leaderBox}>
              <h3 className={sharedStyles.sectionTitle}>🏆 Leaderboard</h3>
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
