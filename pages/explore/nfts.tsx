import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import Image from 'next/image';
import HeaderActionButtons from 'containers/header/HeaderActionButtons';
import styles from '../../styles/Dashboard.module.scss';

export default function Nfts() {
  return (
    <>
      <Head>
        <title>Explore NFTs</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="full">
              <div
                className="tg-title"
                // style={{
                //   position: 'absolute',
                //   backgroundColor: '#fff',
                //   marginTop: -20,
                //   paddingTop: 20,
                //   width: 180,
                //   height: 70,
                //   fontSize: 24
                // }}
              >
                NFT
                {/* <div style={{ position: 'absolute', backgroundColor: '#fff', width: 180, height: 70 }}>&nbsp;</div> */}
              </div>
            </div>

            <div className="left">{/* Filter */}</div>
          </div>

          {/* <iframe
            src="https://opensea.io/assets"
            width="100%"
            style={{ marginTop: -20, height: 'calc(100vh - 150px)' }}
          /> */}

          <div>
            <div>
              First, select an NFT, then get the NFT link by clicking on the <strong>&quot;Share&quot; icon</strong> and{' '}
              <strong>&quot;Copy Link&quot; button</strong> like this screenshot:
            </div>
            <p>&nbsp;</p>
            <div style={{ padding: 10, borderRadius: 6, border: '1px solid #eee' }}>
              <Image alt="Instruction" src="/img/more/copy-instruction.png" width={500} height={320} />
            </div>
          </div>

          <div>
            <ul className={styles.actions}>
              <HeaderActionButtons />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Nfts.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
