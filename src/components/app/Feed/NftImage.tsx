import { useEffect, useState } from 'react';
import { Image } from '@chakra-ui/react';
import { apiGet } from 'utils/apiUtil';
import { NftDetailsResponse } from '@infinityxyz/lib/types/core/CollectionResponse';

type ApiResponse = {
  result: NftDetailsResponse;
};

const NftImage = ({
  tokenAddress,
  tokenId,
  src,
  ...rest
}: {
  tokenAddress: string;
  tokenId: string;
  src?: string;
  [key: string]: string | number | undefined;
}) => {
  const [unmounted, setUnmounted] = useState(false);
  const [imageUrl, setImageUrl] = useState(src || '');

  const getData = async () => {
    if (!tokenAddress || !tokenId || unmounted) {
      return;
    }
    const { result }: ApiResponse = (await apiGet(
      `/collections/ethereum/${tokenAddress}/${tokenId}/image`
    )) as ApiResponse;
    setImageUrl(result?.imageUrl);
  };
  useEffect(() => {
    if (!src) {
      getData();
    }
    return () => {
      setUnmounted(true);
    };
  }, []);
  if (!imageUrl) {
    return null;
  }
  return <Image src={imageUrl} {...rest} alt="" />;
};

export default NftImage;
