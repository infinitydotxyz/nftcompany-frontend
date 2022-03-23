import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { useRouter } from 'next/router';
import styles from './AssetsPage.module.scss';
import { AssetPreview } from 'components/AssetPreview/AssetPreview';
import { AssertDetail } from 'containers/AssertDetail';

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
        <meta name="description" content={`Infinity - NFT:${title} Detail Page`}></meta>
      </Head>
      <AssertDetail
        tokenId={id as string}
        tokenAddress={address as string}
        onTitle={(newTitle: string) => {
          if (!title) {
            setTitle(newTitle);
          }
        }}
      />
    </>
  );
};

AssetsPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;

export default AssetsPage;
