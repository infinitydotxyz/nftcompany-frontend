import { CardData } from 'types/Nft.interface';

// toast = useToast() - import { useToast } from '@chakra-ui/react';
export const showMessage = (toast: any, type: 'success' | 'error' | 'warning' | 'info', message: string) => {
  console.error('*** this showMessage() is deprecated => use "showAppMessage" or "showAppError" from AppContext');
  toast({
    title: type === 'error' ? 'Error' : 'Info',
    description: message,
    status: type,
    duration: type === 'error' ? 10000 : 4000,
    isClosable: true
  });
};

export const transformOpenSea = (item: any, owner: string) => {
  if (!item) {
    return null;
  }

  return {
    id: `${item?.asset_contract?.address}_${item?.token_id}`,
    title: item.name,
    description: item.description,
    image: item.image_url,
    imagePreview: item.image_preview_url,
    tokenAddress: item.asset_contract.address,
    tokenId: item.token_id,
    collectionName: item.asset_contract.name,
    inStock: 1,
    price: 0.1,
    owner: owner
  } as CardData;
};
