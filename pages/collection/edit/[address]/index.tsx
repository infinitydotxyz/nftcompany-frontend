import { Box } from '@chakra-ui/layout';
import { Text, useDisclosure, Image, Button } from '@chakra-ui/react';
import HorizontalLine from 'components/HorizontalLine/HorizontalLine';
import UnauthorizedModal from 'components/UnauthorizedModal/UnauthorizedModal';
import Layout from 'containers/layout';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CollectionData, getAuthenticatedCollectionInfo, getCollectionInfo } from 'services/Collections.service';
import { renderSpinner } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';

const Edit = (): JSX.Element => {
  const router = useRouter();
  const { address } = router.query;
  const [title, setTitle] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { user, showAppError } = useAppContext();
  const [isAuthorized, setIsAuthorized] = useState(true);

  const [collectionInfo, setCollectionInfo] = useState<CollectionData | undefined>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClose = () => {
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
    } else {
      setIsAuthorized(false);
      setIsLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [address, user?.account]);

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
          <Box
            display="flex"
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'flex-start'}
            maxWidth={'750px'}
            margin="auto"
          >
            <Box display="flex" flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
              <Image
                alt="collection profile image"
                src={collectionInfo?.profileImage}
                height={'104px'}
                marginRight={'48px'}
              />
              <Box display="flex" flexDirection={'row'} minWidth={'300px'}>
                <Button marginRight={'16px'} flexBasis={0} flexGrow={1}>
                  Upload new picture
                </Button>
                <Button variant={'alt'} flexBasis={0} flexGrow={1}>
                  Delete
                </Button>
              </Box>
            </Box>

            <HorizontalLine marginY="72px" />

            <Box>
              <Text size="xl" variant="bold">
                Edit Collection
              </Text>
            </Box>
          </Box>
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
