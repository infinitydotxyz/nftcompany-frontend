import { Box } from '@chakra-ui/layout';
import { useDisclosure } from '@chakra-ui/react';
import EditCollectionForm from 'components/EditCollectionForm/EditCollectionForm';
import UnauthorizedModal from 'components/UnauthorizedModal/UnauthorizedModal';
import Layout from 'containers/layout';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CollectionData, getAuthenticatedCollectionInfo } from 'services/Collections.service';
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
          } else {
            setIsAuthorized(false);
            onOpen();
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
          <EditCollectionForm collectionInfo={collectionInfo} userAddress={user?.account} />
        )}
      </div>
      <UnauthorizedModal
        isOpen={isOpen}
        onClose={handleClose}
        message={'Only the creator of the contract can edit the collection.'}
      />
    </>
  );
};

Edit.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Edit;
