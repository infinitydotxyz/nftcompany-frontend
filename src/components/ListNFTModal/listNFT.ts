import { TokenStandardVersion, WyvernSchemaName } from 'types/Nft.interface';
import { apiGet } from 'utils/apiUtil';
import { NFTC_FEE_RECIPIENT, NULL_ADDRESS } from 'utils/constants';
import { getOpenSeaportForChain } from 'utils/ethersUtil';

export interface SellOrderProps {
  hasBonusReward?: boolean;
  hasBlueCheck?: boolean;
  assetDetails?: any;
  asset: Asset;
  accountAddress: string;
  startAmount: number;
  // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
  endAmount?: number;
  quantity?: number;
  listingTime?: number;
  expirationTime?: number;
  waitForHighestBid?: boolean;
  englishAuctionReservePrice?: number;
  paymentTokenAddress?: string;
  extraBountyBasisPoints?: number;
  buyerAddress?: string;
  buyerEmail?: string;
}

export interface Asset {
  // The asset's token ID, or null if ERC-20
  tokenId: string | null;
  // The asset's contract address
  tokenAddress: string;
  // The Wyvern schema name (e.g. "ERC721") for this asset
  schemaName?: WyvernSchemaName;
  // The token standard version of this asset
  version?: TokenStandardVersion;
  // Optional for ENS names
  name?: string;
  // Optional for fungible items
  decimals?: number;
}

type Order = unknown;

type VerifiedBonusResponse = { verified?: boolean; bonusReward?: boolean } | undefined;

export async function fetchVerifiedBonusReward(tokenAddress: string): Promise<VerifiedBonusResponse> {
  const { result } = await apiGet(`/token/${tokenAddress}/verfiedBonusReward`);
  return result;
}

/**
 *
 * @param data to create an order with
 * @returns a Promise of an OpenSea Order
 * @THROWS an error if we fail to create the sell order
 */
export async function createSellOrder(data: SellOrderProps & { chainId?: string }): Promise<Order> {
  if (!data.startAmount) {
    throw new Error('Please enter price');
  }

  const seaport = getOpenSeaportForChain(data.chainId);

  return seaport.createSellOrder(data);
}
