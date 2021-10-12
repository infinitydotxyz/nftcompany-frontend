import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { useRouter } from 'next/router';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';

const Collection = (): JSX.Element => {
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

            <div style={{ flex: 1 }} />

            <SortMenuButton />
          </div>

          {id && (
            <CollectionContents
              id={id as string}
              address={address as string}
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

Collection.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Collection;

// =============================================================

type Props = {
  id: string;
  address: string;
  onTitle: (title: string) => void;
};

const CollectionContents = ({ id, address, onTitle }: Props): JSX.Element => {
  return (
    <>
      <div>hello</div>
    </>
  );
};
