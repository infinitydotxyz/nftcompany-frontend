import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { API_BASE_MAINNET } from '../../opensea/constants';
import { getAccount } from 'utils/ethersUtil';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from './Rewards.module.scss';

function float2dollar(value: number) {
  return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

function formatXAxesLabelText(label: string) {
  if (/\s/.test(label)) {
    return label.split(' ');
  }

  return label;
}

const chartData = {
  labels: ['Orders', 'Bonus', 'Fee', 'Gross', 'Penalty', 'Net'],
  datasets: [
    {
      label: 'Rewards', // legend
      data: [1, 2, 4, 8, 2, 15],
      backgroundColor: 'blue'
    }
  ]
};

const options = {
  responsive: false,
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false,
          color: 'blue'
        },
        ticks: {
          beginAtZero: true,
          fontFamily: 'Verdana',
          fontColor: '#777',
          callback: (label: string) => formatXAxesLabelText(label)
        }
      }
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          display: false,
          color: 'blue'
        },
        ticks: {
          beginAtZero: false,
          fontColor: '#777',
          callback: (value: string) => value
        },
        pointLabels: {
          fontFamily: 'Verdana',
          fontSize: 34
        }
      }
    ]
  }
};

export default function Rewards() {
  const [user, setUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const account = await getAccount();
    setUser({ account });

    setIsFetching(true);
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
        <title>Rewards</title>
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
              <div className={`col-md-3 col-sm-6 ${styles.rewardBox}`}>
                <h3>Total Tx Volume</h3>
                <div>$242,869,800</div>
              </div>
              <div className={`col-md-3 col-sm-6 ${styles.rewardBox}`}>
                <h3>NFTS Rewards</h3>
                <div>$242,869,800</div>
              </div>
              <div className={`col-md-3 col-sm-6 ${styles.rewardBox}`}>
                <h3>NFTS Price</h3>
                <div>$242,869,800</div>
              </div>
              <div className={`col-md-3 col-sm-6 ${styles.rewardBox}`}>
                <h3>Time Left</h3>
                <div>15:32:00</div>
              </div>

              {/* Chart */}
              {/* <div className={`col-md-12 col-sm-12 ${styles.leaderBox}`}>
                <h3 className="tg-title">Rewards 💰</h3>

                <ul className={styles.list}>
                  <li>
                    <span>Current Block</span>
                    <span>{data?.currentBlock || 0}</span>
                  </li>
                  <li>
                    <span>Your Rewards:</span>
                    <span>&nbsp;</span>
                  </li>
                  <li>
                    <Bar width={500} height={200} data={chartData} options={options} />
                  </li>
                </ul>
              </div> */}

              <div className={`col-md-12 col-sm-12`}>
                <h3 className={styles.h3}>My Rewards 💰</h3>
              </div>

              <div className={`col-md-3 col-sm-6 ${styles.myRewardBox}`}>
                <h3>Listing Rewards</h3>
                <main>
                  <div className="grid">
                    <span className="col-md-6">APR</span>
                    <span className="col-md-6">10%</span>
                  </div>
                  <div className="grid">
                    <span className="col-md-6">Listings</span>
                    <span className="col-md-6">{data?.numListings || 0}</span>
                  </div>
                  <div className="grid">
                    <span className="col-md-6">Total</span>
                    <span className="col-md-6">{data?.totalListings || 0}</span>
                  </div>
                </main>
              </div>
              <div className={`col-md-3 col-sm-6 ${styles.myRewardBox}`}>
                <h3>Bonus Rewards</h3>
                <main>
                  <div className="grid">
                    <span className="col-md-6">APR</span>
                    <span className="col-md-6">10%</span>
                  </div>
                  <div className="grid">
                    <span className="col-md-6">Bonus Rewards</span>
                    <span className="col-md-6">{data?.numBonusListings || 0}</span>
                  </div>
                  <div className="grid">
                    <span className="col-md-6">Total</span>
                    <span className="col-md-6">{data?.totalListings || 0}</span>
                  </div>
                </main>
              </div>
              <div className={`col-md-3 col-sm-6 ${styles.myRewardBox}`}>
                <h3>Fee Rewards</h3>
                <main>
                  <div className="grid">
                    <span className="col-md-6">APR</span>
                    <span className="col-md-6">10%</span>
                  </div>
                  <div className="grid">
                    <span className="col-md-6">Fee Rewards</span>
                    <span className="col-md-6">{data?.feesPaid || 0}</span>
                  </div>
                  <div className="grid">
                    <span className="col-md-6">Total</span>
                    <span className="col-md-6">{data?.totalListings || 0}</span>
                  </div>
                </main>
              </div>
              <div className={`col-md-3 col-sm-6 ${styles.myRewardBox}`}>
                <h3>Net Rewards</h3>
                <main>
                  <div className="grid">
                    <span className="col-md-6">APR</span>
                    <span className="col-md-6">10%</span>
                  </div>
                  <div className="grid">
                    <span className="col-md-6">Net Rewards</span>
                    <span className="col-md-6">{data?.feesPaid || 0}</span>
                  </div>
                  <div className="grid">
                    <span className="col-md-6">Total</span>
                    <span className="col-md-6">{data?.totalListings || 0}</span>
                  </div>
                </main>
              </div>

              <div className={`col-md-12 col-sm-12 ${styles.leaderBox}`}>
                <h3 className={styles.h3}>Leaderboard 🏆</h3>
                <div className={styles.leaderBody}>
                  <Table mt={4}>
                    <Thead>
                      <Tr>
                        <Th>Rank</Th>
                        <Th>Address</Th>
                        <Th isNumeric>Listings</Th>
                        <Th isNumeric>Rewards</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>#1</Td>
                        <Td>0xksjup...qu38e</Td>
                        <Td isNumeric>150</Td>
                        <Td isNumeric>1100</Td>
                      </Tr>
                      <Tr>
                        <Td>#2</Td>
                        <Td>0xak8y5...ke7uy</Td>
                        <Td isNumeric>90</Td>
                        <Td isNumeric>1000</Td>
                      </Tr>
                      <Tr>
                        <Td>#3</Td>
                        <Td>0xaal9r...33jfy</Td>
                        <Td isNumeric>82</Td>
                        <Td isNumeric>850</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </div>
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
