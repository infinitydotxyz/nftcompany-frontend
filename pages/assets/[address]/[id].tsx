import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { useRouter } from 'next/router';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import { AssetPreview } from 'components/AssetPreview/AssetPreview';

const AssetsPage = (): JSX.Element => {
  const [title, setTitle] = useState<string | undefined>();
  const router = useRouter();
  const {
    query: { address, id }
  } = router;

  return (
    <>
      <Head>
        <title>NFT</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">{title || id}</div>
          </div>

          {id && (
            <AssetPreview
              tokenId={id as string}
              tokenAddress={address as string}
              onTitle={(newTitle) => {
                if (!title) {
                  setTitle(newTitle);
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

AssetsPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default AssetsPage;
