import { Box, SimpleGrid, Spacer } from '@chakra-ui/layout';
import { Text, useDisclosure, Image, Button, Input, FormLabel, Textarea } from '@chakra-ui/react';
import EditCollectionForm from 'components/EditCollectionForm/EditCollectionForm';
import HorizontalLine from 'components/HorizontalLine/HorizontalLine';
import UnauthorizedModal from 'components/UnauthorizedModal/UnauthorizedModal';
import Layout from 'containers/layout';
import { reject } from 'lodash';
import { NextPage } from 'next';
import { resolveHref } from 'next/dist/shared/lib/router/router';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { CollectionData, getAuthenticatedCollectionInfo, getCollectionInfo } from 'services/Collections.service';
import { renderSpinner } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';

const Edit = (): JSX.Element => {
  const router = useRouter();
  const { address } = router.query;
  const [title, setTitle] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { user, showAppError, userReady } = useAppContext();
  const [isAuthorized, setIsAuthorized] = useState(true);

  const [profileImage, setProfileImage] = useState('');

  const [collectionInfo, setCollectionInfo] = useState<CollectionData | undefined>();

  useEffect(() => {
    setProfileImage(collectionInfo?.profileImage ?? '');
  }, [collectionInfo?.profileImage]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClose = () => {
    // return to the previous page on close
    router.back();
    onClose();
  };

  useEffect(() => {
    if (!isAuthorized) {
      onOpen();
    } else {
      onClose();
    }
  }, [isAuthorized]);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    if (address && user?.account) {
      getAuthenticatedCollectionInfo(address as string, user?.account)
        .then((collectionInfo) => {
          if (isActive) {
            setCollectionInfo(collectionInfo);
            setIsAuthorized(true);
          }
        })
        .catch((err: any) => {
          console.error(err);
          setIsAuthorized(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (userReady) {
      setIsAuthorized(false);
      setIsLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [address, user?.account, userReady]);

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
          <EditCollectionForm collectionInfo={collectionInfo} />
        )}
      </div>
      <UnauthorizedModal
        isOpen={isOpen}
        onClose={handleClose}
        message={
          'You are not authorized to view this page. Please login with the account used to publish the contract.'
        }
      />
    </>
  );
};

Edit.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Edit;
