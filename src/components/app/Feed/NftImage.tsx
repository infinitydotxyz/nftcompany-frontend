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
  ...rest
}: {
  tokenAddress: string;
  tokenId: string;
  [key: string]: string | number;
}) => {
  const [unmounted, setUnmounted] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
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
    getData();
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
