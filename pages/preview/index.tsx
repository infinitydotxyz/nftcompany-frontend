import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Box, Select } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import { sampleData, sampleUserList } from '../../src/utils/apiUtil';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from './Preview.module.scss';
import TabBar from 'components/TabBar/TabBar';
import UserList from 'components/UserList/UserList';
import BidBox from 'components/BidBox/BidBox';

export default function Preview() {
  const router = useRouter();
  const {
    query: { id }
  } = router;
  const idNum = parseInt(`${id}` ?? '0');
  const data = sampleData[idNum];
  const [tabIndex, setTabIndex] = React.useState(1);

  const title = React.useMemo(() => {
    switch (tabIndex) {
      case 1:
        return 'Preview';
        break;

      default:
        break;
    }
  }, [tabIndex]);

  return (
    <>
      <Head>
        <title>Preview page</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">{/* <div className="tg-title">{title}</div> */}</div>

            <div className="center">{/* Center */}</div>

            <div className="left">
              {/* <Select
                placeholder="Filter..."
                fontWeight={500}
                lineHeight={'40px'}
                borderRadius={40}
                colorScheme="blackAlpha"
              >
                <option value="option1">New items</option>
                <option value="option2">Great Items</option>
              </Select> */}
            </div>
          </div>

          <div className={styles.main}>
            {/* <Card data={sampleData[idNum]} /> */}
            {data && data.img && <img src={data.img} />}

            <section className={styles.info}>
              <h3>{data?.title}</h3>
              <span className={styles.price}>{data?.price} ETH</span>
              <span className={styles.counter}>10 in stock</span>

              <div className={styles.description}>{data?.description}</div>

              <TabBar />

              <p>&nbsp;</p>

              <UserList data={sampleUserList} />

              <BidBox user={sampleUserList[0]} />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Preview.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
