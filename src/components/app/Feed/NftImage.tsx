import { useEffect, useState } from 'react';
import { Image } from '@chakra-ui/react';
import { apiGet } from 'utils/apiUtil';

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
    const { result } = await apiGet(`/nfts/ethereum/${tokenAddress}/${tokenId}/image`);
    setImageUrl(result);
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
  return <Image src={imageUrl} {...rest} />;
};

export default NftImage;
