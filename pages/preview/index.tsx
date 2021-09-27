import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from 'containers/layout';
import { sampleData, sampleUserLists } from '../../src/utils/apiUtil';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from './Preview.module.scss';
import TabBar from 'components/TabBar/TabBar';
import UserList from 'components/UserList/UserList';
import BidBox from 'components/BidBox/BidBox';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { Button } from '@chakra-ui/react';

const Tabs = [
  {
    id: '0',
    label: 'Info'
  },
  {
    id: '1',
    label: 'Owners'
  },
  {
    id: '2',
    label: 'History'
  },
  {
    id: '3',
    label: 'Bids'
  }
];

export default function Preview() {
  const [activeTab, setActiveTab] = useState(Tabs[3].id);
  const [placeBidShowed, setPlaceBidShowed] = useState(false);
  const router = useRouter();
  const {
    query: { id, view = '' }
  } = router;
  const idNum = parseInt(`${id}` ?? '0');
  const data = sampleData[idNum];
  const [tabIndex, setTabIndex] = useState(1);
  console.log('view', view);

  const title = React.useMemo(() => {
    switch (tabIndex) {
      case 1:
        return 'Preview';
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
        <div className="page-container">
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
            {data && data.image && (
              <img
                alt="not available"
                src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
              />
            )}

            <section className={styles.info}>
              <h3>{data?.title}</h3>
              <PriceBox price={data?.price} />
              <span className={styles.counter}>10 in stock</span>
              <div className={styles.description}>{data?.description}</div>
              {view === 'info' ? null : (
                <>
                  <TabBar tabs={Tabs} activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} />

                  <p>&nbsp;</p>

                  <UserList data={sampleUserLists[parseInt(activeTab)]} />

                  <BidBox user={sampleUserLists[0][0]}>
                    <Button colorScheme="gray" onClick={() => setPlaceBidShowed(true)}>
                      Purchase now
                    </Button>
                  </BidBox>
                </>
              )}

              {/* SNG fix later.  data is not CardData, using test data and this page isn't used anywhere */}
              {placeBidShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidShowed(false)} />}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Preview.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
