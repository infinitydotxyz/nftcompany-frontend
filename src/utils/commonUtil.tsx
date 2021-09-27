import { CardData } from 'types/Nft.interface';
import { WETH_ADDRESS } from './constants';

// OpenSea's EventType
export enum EventType {
  // Transactions and signature requests
  TransactionCreated = 'TransactionCreated',
  TransactionConfirmed = 'TransactionConfirmed',
  TransactionDenied = 'TransactionDenied',
  TransactionFailed = 'TransactionFailed',

  // Basic actions: matching orders, creating orders, and cancelling orders
  MatchOrders = 'MatchOrders',
  CancelOrder = 'CancelOrder',
  ApproveOrder = 'ApproveOrder',
  CreateOrder = 'CreateOrder',
  // When the signature request for an order is denied
  OrderDenied = 'OrderDenied',

  ApproveCurrency = 'ApproveCurrency'
}

export const isServer = () => typeof window === 'undefined';

export const isLocalhost = () =>
  typeof window !== 'undefined' && (window?.location?.host || '').indexOf('localhost') >= 0;

export const ellipsisAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export const getToken = (tokenAddress: string): 'WETH' | 'ETH' => (tokenAddress === WETH_ADDRESS ? 'WETH' : 'ETH');

// parse a Timestamp string (in millis or secs)
export const parseTimestampString = (dt: string, inSecond: boolean = false): Date | null => {
  let dateObj = null;
  if (!dt || dt === '0') {
    return null;
  }
  try {
    const dtNum = parseInt(dt);
    dateObj = new Date(dtNum * (inSecond ? 1000 : 1));
  } catch (err) {
    console.error(err);
  }
  return dateObj;
};

export const stringToFloat = (numStr: string | undefined, defaultValue = 0) => {
  let num = defaultValue;
  if (!numStr) {
    return num;
  }
  try {
    num = parseFloat(numStr);
  } catch (e) {
    console.error(e);
  }
  return num;
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
    owner: owner,
    schemaName: item['asset_contract']['schema_name']
  } as CardData;
};

export const getCustomMessage = (eventName: string, data: any) => {
  let customMsg: JSX.Element | string | null = null;
  const ev = data?.event;
  const createLink = (transactionHash: string) => (
    <a className="a-link" href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noreferrer">
      {data?.transactionHash}
    </a>
  );

  if (eventName === EventType.TransactionCreated) {
    if (ev === EventType.MatchOrders) {
      customMsg = (
        <span>MatchOrders: Your transaction has been sent to chain. {createLink(data?.transactionHash)}</span>
      );
    }
    if (ev === EventType.CancelOrder) {
      customMsg = (
        <span>CancelOrder: Your transaction has been sent to chain. {createLink(data?.transactionHash)}</span>
      );
    }
  }
  if (eventName === EventType.TransactionDenied) {
    customMsg = 'Transaction denied.';
  }
  if (eventName === EventType.TransactionConfirmed) {
    if (ev === EventType.CancelOrder) {
      customMsg = 'CancelOrder: Transaction confirmed.';
    }
  }
  if (eventName === EventType.MatchOrders) {
    customMsg = <span>MatchOrders: Your transaction has been sent to chain. {createLink(data?.transactionHash)}</span>;
  }
  if (eventName === EventType.ApproveCurrency) {
    customMsg = 'Approving currency for trading.';
  }
  return customMsg;
};

// if items used their title as a key they ran the risk of having the same value
// to fix this we can use a guid generator instead
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// makes number strings from strings or numbers
export const numStr = (value: any): string => {
  let short;

  if (typeof value === 'undefined' || value === null) {
    short = '';
  } else if (typeof value === 'string') {
    if (value.includes('.')) {
      const f = parseFloat(value);
      if (f) {
        short = f.toFixed(4);
      }
    }

    short = value;
  } else if (typeof value === 'number') {
    short = value.toFixed(4);
  } else {
    short = value.toString();
  }

  // remove .0000
  let zeros = '.0000';
  if (short.endsWith(zeros)) {
    short = short.substring(0, short.length - zeros.length);
  }

  // .9800 -> .98
  if (short.includes('.')) {
    zeros = '00';
    if (short.endsWith(zeros)) {
      short = short.substring(0, short.length - zeros.length);
    }
  }

  const p = parseFloat(short);
  if (!isNaN(p)) {
    // this adds commas
    return p.toLocaleString();
  }

  return short;
};
