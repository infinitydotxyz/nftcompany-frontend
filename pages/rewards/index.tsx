import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { API_BASE_MAINNET } from '../../src-os/src/constants';
import { getAccount } from 'utils/ethersUtil';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from './Rewards.module.scss';

export default function Rewards() {
  const [user, setUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const account = await getAccount();
    setUser({ account });

    await setIsFetching(true);
    try {
      const res = await fetch(`${API_BASE_MAINNET}/u/${account}/reward`);
      const data = (await res.json()) || [];
      console.log('data', data);
      setData(data);
    } catch (e) {
      console.error(e);
    }
  }
  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Offers</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">{/* <div className="tg-title">{title}</div> */}</div>

            <div className="center">{/* Center */}</div>

            <div className="left">{/* TBD */}</div>
          </div>

          <div className={styles.main}>
            <section className="container container-fluid grid">
              <div className="col-md-6 col-sm-12">
                <h3 className="tg-title">Rewards</h3>

                <ul className={styles.list}>
                  <li>
                    <span>Orders Reward</span>
                    <span>{data?.ordersReward}</span>
                  </li>
                  <li>
                    <span>Bonus Reward</span>
                    <span>{data?.bonusReward}</span>
                  </li>
                  <li>
                    <span>Fee Reward</span>
                    <span>{data?.feeReward}</span>
                  </li>
                  <li>
                    <span>Gross Reward</span>
                    <span>{data?.grossReward}</span>
                  </li>
                  <li>
                    <span>Penalty</span>
                    <span>{data?.penalty}</span>
                  </li>
                  <li>
                    <span>NetReward</span>
                    <span>{data?.netReward}</span>
                  </li>
                </ul>
              </div>

              {/* <div className="col-md-6 col-sm-12">
                <h3 className="tg-title">Sale Rewards:</h3>

                <ul style={{ marginTop: 10 }}>
                  <li>ordersReward</li>
                  <li>Reward 2</li>
                </ul>
              </div> */}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Rewards.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
