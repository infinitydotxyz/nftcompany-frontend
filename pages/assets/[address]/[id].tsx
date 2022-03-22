import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { useRouter } from 'next/router';
import styles from './AssetsPage.module.scss';
import { AssetPreview } from 'components/AssetPreview/AssetPreview';
import { AssertDetail } from 'containers/assert';

const AssetsPage = (): JSX.Element => {
  const [title, setTitle] = useState<string | undefined>();
  const router = useRouter();

  const {
    query: { address, id }
  } = router;

  return (
    <>
      <Head>
        <title>{`NFT: ${title ?? ''}`}</title>
        <meta name="description" content="Infinity NFT Detail Page"></meta>
      </Head>
      <AssertDetail
        onTitle={(newTitle) => {
          if (!title) {
            setTitle(newTitle);
          }
        }}
      />

      <div>
        <div className="page-container">
          <div className={styles.insetPage}>
            {id && (
              <div style={{ marginTop: 20 }}>
                <AssetPreview
                  tokenId={id as string}
                  tokenAddress={address as string}
                  onTitle={(newTitle) => {
                    if (!title) {
                      setTitle(newTitle);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {} // will be passed to the page component as props
  };
}

AssetsPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;

export default AssetsPage;
