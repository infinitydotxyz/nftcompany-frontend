import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Collections.module.scss';
import { CollectionCards } from 'components/CollectionCards/CollectionCards';
import { ViewControl } from 'components/ViewControl/ViewControl';

const Collections = (): JSX.Element => {
  const [mode, setMode] = useState<'icon' | 'list'>('icon');

  return (
    <>
      <Head>
        <title>NFT Collections</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Verified Collections</div>

            <div className={styles.row}>
              <ViewControl
                disabled={true} // disabled for now
                mode={mode}
                onClick={(m) => {
                  setMode(m);
                }}
              />
            </div>
          </div>
          <CollectionCards listMode={mode === 'list'} />
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
Collections.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Collections;
