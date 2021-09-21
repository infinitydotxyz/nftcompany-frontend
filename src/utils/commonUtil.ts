import { CardData } from 'types/Nft.interface';

// OpenSea's EventType
export enum EventType {
  // Transactions and signature requests
  TransactionCreated = "TransactionCreated",
  TransactionConfirmed = "TransactionConfirmed",
  TransactionDenied = "TransactionDenied",
  TransactionFailed = "TransactionFailed",

  // Basic actions: matching orders, creating orders, and cancelling orders
  MatchOrders = "MatchOrders",
  CancelOrder = "CancelOrder",
  ApproveOrder = "ApproveOrder",
  CreateOrder = "CreateOrder",
  // When the signature request for an order is denied
  OrderDenied = "OrderDenied",
}

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
    owner: owner
  } as CardData;
};

export const getCustomMessage = (eventName: string, data: any) => {
  let customMsg = '';
  const ev = data?.event;
  if (eventName === EventType.TransactionCreated) {
    if (ev === 'MatchOrders') {
      customMsg = 'MatchOrders: Your transaction has been sent to chain.';
    }
    if (ev === EventType.CancelOrder) {
      customMsg = 'CancelOrder: Your transaction has been sent to chain.';
    }
  }
  if (eventName === EventType.TransactionConfirmed) {
    if (ev === EventType.CancelOrder) {
      customMsg = 'CancelOrder: Transaction confirmed.';
    }
  }
  return customMsg;
}
