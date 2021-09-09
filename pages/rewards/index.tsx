import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { API_BASE_MAINNET } from '../../src-os/src/constants';
import { getAccount } from 'utils/ethersUtil';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
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
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const numListingsPct = data?.totalListings > 0 ? data?.numListings / data?.totalListings : 0;
  const numBonusListingsPct = data?.totalBonusListings > 0 ? data?.numBonusListings / data?.totalBonusListings : 0;
  const feesPaidPct = data?.totalFees > 0 ? data?.feesPaid / data?.totalFees : 0;

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

              {/* Second Column */}
              <div className="col-md-6 col-sm-12">
                <h3 className="tg-title">Listings:</h3>

                <ul className={styles.list}>
                  <li>
                    <span>Total Listings</span>
                    <span className={styles.bar}>{data?.totalListings}</span>
                  </li>
                  <li>
                    <span>Your Listings</span>
                    <span className={styles.bar} style={{ width: `${20 * numListingsPct}vw` }}>
                      {data?.numListings}
                    </span>
                  </li>
                </ul>

                <h3 className="tg-title">Bonus Listings:</h3>

                <ul className={styles.list}>
                  <li>
                    <span>Total Bonus Listings</span>
                    <span className={styles.bar}>{data?.totalListings}</span>
                  </li>
                  <li>
                    <span>Your Bonus Listings</span>
                    <span className={styles.bar} style={{ width: `${20 * numBonusListingsPct}vw` }}>
                      {data?.numBonusListings > 0 ? data?.numBonusListings : 0}
                    </span>
                  </li>
                </ul>

                <h3 className="tg-title">Fees:</h3>

                <ul className={styles.list}>
                  <li>
                    <span>Total Fees</span>
                    <span className={styles.bar}>{data?.totalListings}</span>
                  </li>
                  <li>
                    <span>Your Paid Fees</span>
                    <span className={styles.bar} style={{ width: `${20 * feesPaidPct}vw` }}>
                      {data?.feesPaid > 0 ? data?.feesPaid : 0}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="col-md-6 col-sm-12">
                <h3 className="tg-title">Rewards</h3>

                <ul className={styles.list}>
                  <li>
                    <span>Current Block</span>
                    <span>{data?.currentBlock}</span>
                  </li>
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

                <h3 className="tg-title">Leaderboard</h3>
                <Table mt={4} width={'100%'}>
                  <Thead>
                    <Tr>
                      <Th>Rank</Th>
                      <Th>Name</Th>
                      <Th isNumeric>Rewards</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>#1</Td>
                      <Td>John Doe</Td>
                      <Td isNumeric>1100</Td>
                    </Tr>
                    <Tr>
                      <Td>#2</Td>
                      <Td>Jane Doe</Td>
                      <Td isNumeric>1000</Td>
                    </Tr>
                    <Tr>
                      <Td>#3</Td>
                      <Td>Marry</Td>
                      <Td isNumeric>850</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </div>

              
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Rewards.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
