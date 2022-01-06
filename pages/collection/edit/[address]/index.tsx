import { Box } from '@chakra-ui/layout';
import Layout from 'containers/layout';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CollectionData, getCollectionInfo } from 'services/Collections.service';
import { renderSpinner } from 'utils/commonUtil';

const Edit = (): JSX.Element => {
  const router = useRouter();
  const { address } = router.query;
  const [title, setTitle] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [collectionInfo, setCollectionInfo] = useState<CollectionData | undefined>();

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    getCollectionInfo(address as string)
      .then((collectionInfo) => {
        if (isActive) {
          setCollectionInfo(collectionInfo);
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });

    return () => {
      isActive = false;
    };
  }, [name]);

  return (
    <>
      <Head>
        <title>{address}</title>
      </Head>
      <div className="page-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {isLoading ? (
          <Box display="flex" justifyContent={'center'} alignItems={'center'} height="400px">
            <div>{renderSpinner()}</div>
          </Box>
        ) : (
          <Box> Edit loaded</Box>
        )}
      </div>
    </>
  );
};

Edit.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Edit;
