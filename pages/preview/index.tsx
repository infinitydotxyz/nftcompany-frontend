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
import PurchaseModal from 'components/PurchaseModal/PurchaseModal';

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
  const [purchaseShowed, setPurchaseShowed] = useState(false);
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
            {data && data.image && (
              <img src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'} />
            )}

            <section className={styles.info}>
              <h3>{data?.title}</h3>
              <span className={styles.price}>{data?.price} ETH</span>
              <span className={styles.counter}>10 in stock</span>

              <div className={styles.description}>{data?.description}</div>

              {view === 'info' ? null : (
                <>
                  <TabBar tabs={Tabs} activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} />

                  <p>&nbsp;</p>

                  <UserList data={sampleUserLists[parseInt(activeTab)]} />

                  <BidBox user={sampleUserLists[0][0]}>
                    <a className="action-btn" onClick={() => setPurchaseShowed(true)}>
                      Purchase now
                    </a>
                    <a className="action-btn action-2nd" onClick={() => setPlaceBidShowed(true)}>
                      Place a bid
                    </a>
                  </BidBox>
                </>
              )}

              {placeBidShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidShowed(false)} />}
              {purchaseShowed && <PurchaseModal onClose={() => setPurchaseShowed(false)} />}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Preview.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
