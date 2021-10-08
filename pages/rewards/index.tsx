import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Rewards.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';
import { LeaderBoard, UserReward } from '../../src/types/rewardTypes';
import { Spinner } from '@chakra-ui/spinner';
import { RewardCardRow } from 'components/RewardCardList/RewardCardList';
import { LeaderboardCard } from 'components/RewardCard/RewardCard';
import CountryConfirmModal from 'components/CountryConfirmModal/CountryConfirmModal';

const Rewards = (): JSX.Element => {
  const { user, showAppError } = useAppContext();
  const [countryConfirmShowed, setCountryConfirmShowed] = useState(false);
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
      if (error) {
        showAppError('Failed to fetch rewards.');
      } else {
        const userReward = result as UserReward;
        setUserReward(userReward);
        if (userReward.usPerson === 'NONE') {
          // user has not confirmed eligibility: show Confirm modal
          setCountryConfirmShowed(true);
        }
      }
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
          <div className={styles.spinner}>
            <div>
              <Spinner color="brandBlue" thickness="4px" height={26} width={26} emptyColor="gray.200" speed=".8s" />
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
          <div className={styles.content}>
            <div className={styles.centered}>
              <div className="section-bar" style={{ marginBottom: 30 }}>
                <div className="tg-title">Rewards</div>
              </div>
              <RewardCardRow data={userReward} />
              <div className={styles.leaderBox}>
                <LeaderboardCard data={leaderboard} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {countryConfirmShowed && (
        <CountryConfirmModal
          onSubmit={() => {
            // user confirmed eligibility
            setCountryConfirmShowed(false);
          }}
          onClose={() => setCountryConfirmShowed(false)}
        />
      )}
    </>
  );
};

// eslint-disable-next-line react/display-name
Rewards.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Rewards;
