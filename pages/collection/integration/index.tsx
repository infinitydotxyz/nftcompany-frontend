import { Text } from '@chakra-ui/layout';
import { CollectionIntegrations } from '@infinityxyz/lib/types/core';
import BlankLayout from 'containers/blanklayout';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getAuthenticatedCollectionInfo } from 'services/Collections.service';
import { apiPost } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';

const Integration = (): JSX.Element => {
  const router = useRouter();
  const { address, type } = router.query;
  const { user, chainId } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const verify = async (userAccount: string) => {
    const info = await getAuthenticatedCollectionInfo(address as string, userAccount, chainId);
    const isAuthorized = !!info;
    return isAuthorized;
  };

  const submit = async () => {
    if (type === 'discord') {
      const { guildId } = router.query;
      const payload: CollectionIntegrations = {
        discord: {
          guildId: guildId as string
        }
      };
      const { error } = await apiPost(`/collection/u/${user?.account}/${address}/integrations`, {}, payload);
      if (error) {
        throw error;
      }
    }
  };

  useEffect(() => {
    if (address && user?.account) {
      verify(user.account)
        .then((isAuth) => {
          setIsLoading(false);

          if (!isAuth) {
            throw new Error('unauthorized');
          }

          setIsAuthorized(isAuth);

          return submit();
        })
        .then(() => {
          router.push(`/collection/edit/${address}`);
        })
        .catch(console.error);
    }
  }, [address, user?.account]);

  return (
    <>
      {isLoading && <Text>Verifying...</Text>}
      {!isLoading && !isAuthorized && (
        <Text>Unauthorized to perform this action! Please connect the right account and try again.</Text>
      )}
    </>
  );
};

Integration.getLayout = (page: NextPage) => <BlankLayout>{page}</BlankLayout>;
export default Integration;
