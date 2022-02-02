export interface AlchemyUserAssetResponse {
  totalCount: number;
  blockHash: string;
  pageKey?: string;
  ownedNfts: AlchemyUserAsset[];
}

export interface AlchemyUserAsset {
  contract: {
    address: string;
  };
  id: {
    tokenId: string;
    tokenMetadata: {
      tokenType: string;
    };
  };
  title: string;
  description: string;
  tokenUri: {
    raw: string;
    gateway: string;
  };
  media: Media[];
  metadata: Metadata;
  timeLastUpdated: string;
  traits: WyvernTrait[];
}

interface Media {
  uri: {
    raw: string;
    gateway: string;
  };
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  external_link: string;
  attributes: WyvernTrait[];
}

export interface WyvernTrait {
  trait_type: string;
  trait_count: number;
  display_type?: any;
  value: string;
  max_value?: any;
}
