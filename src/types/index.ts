export type GenericError = {
  message: string;
};

export enum NftAction {
  CancelListing = 'CANCEL_LISTING',
  CancelOffer = 'CANCEL_OFFER',
  AcceptOffer = 'ACCEPT_OFFER',
  ListNft = 'LIST_NFT',
  ViewOrder = 'VIEW_ORDER',
  BuyNft = 'BUY_NFT',
  ImportOrder = 'IMPORT_ORDER'
}
