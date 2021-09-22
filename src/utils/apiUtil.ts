import axios, { AxiosInstance } from 'axios';
import qs from 'query-string';
import { API_BASE } from './constants';
import { getAccount, getWeb3 } from './ethersUtil';
const personalSignAsync = require('../../opensea/utils/utils').personalSignAsync;

const axiosApi: AxiosInstance = axios.create({
  headers: {}
});

export const sampleData = [
  {
    id: '0',
    title: 'Amazing Art',
    description:
      'This NFT Card will give you Access to Special Airdrops. To learn more about UI8 please visit https://ui8.net',
    price: 0.1,
    inStock: 1,
    image: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-1.jpg'
  },
  {
    id: '1',
    title: 'Ribbon Hunter',
    price: 0.2,
    inStock: 2,
    image: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-2.jpg'
  },
  {
    id: '2',
    title: 'Gems',
    price: 0.3,
    inStock: 3,
    image: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-3.jpg'
  },
  {
    id: '3',
    title: 'Art',
    price: 0.4,
    inStock: 4,
    image: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-4.jpg'
  }
];

export const sampleUserLists = [
  [
    {
      id: '7',
      name: 'Kohaku Tora',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-7.jpg',
      bid: 1.46
    },
    {
      id: '2',
      name: 'Raquel Will',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-2.jpg',
      bid: 1.3
    },
    {
      id: '1',
      name: 'Adah Mitchell',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-1.jpg',
      bid: 1.15
    }
  ],
  [
    {
      id: '1',
      name: 'Kohaku Tora',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-1.jpg',
      bid: 1.46
    },
    {
      id: '2',
      name: 'Raquel Will',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-2.jpg',
      bid: 1.3
    },
    {
      id: '7',
      name: 'Adah Mitchell',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-7.jpg',
      bid: 1.15
    }
  ],
  [
    {
      id: '7',
      name: 'Kohaku Tora',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-7.jpg',
      bid: 1.46
    },
    {
      id: '2',
      name: 'Raquel Will',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-2.jpg',
      bid: 1.3
    },
    {
      id: '1',
      name: 'Adah Mitchell',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-1.jpg',
      bid: 1.15
    }
  ],
  [
    {
      id: '1',
      name: 'Kohaku Tora',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-1.jpg',
      bid: 1.46
    },
    {
      id: '2',
      name: 'Raquel Will',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-2.jpg',
      bid: 1.3
    },
    {
      id: '7',
      name: 'Adah Mitchell',
      avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-7.jpg',
      bid: 1.15
    }
  ]
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function setAuthHeaders(address: string) {
  if (!address) {
    return;
  }
  const localStorage = window.localStorage;
  const user = address.trim().toLowerCase();
  const currentUser = localStorage.getItem('CURRENT_USER');
  if (currentUser === user) {
    return;
  }
  const msg = 'LOGIN';
  const sign = await personalSignAsync(getWeb3(), msg, address);
  const sig = JSON.stringify(sign);
  localStorage.setItem('CURRENT_USER', user);
  localStorage.setItem('X-AUTH-SIGNATURE', sig);
  localStorage.setItem('X-AUTH-MESSAGE', msg);
}

export async function getAuthHeaders() {
  // fetch auth signature and message from local storage
  const localStorage = window.localStorage;
  let sig = localStorage.getItem('X-AUTH-SIGNATURE') || '';
  const msg = localStorage.getItem('X-AUTH-MESSAGE') || 'LOGIN';
  // if they are empty, resign and store
  if (!sig) {
    console.log('No auth found, re logging in');
    const sign = await personalSignAsync(getWeb3(), msg, await getAccount());
    sig = JSON.stringify(sign);
    localStorage.setItem('X-AUTH-SIGNATURE', sig);
    localStorage.setItem('X-AUTH-MESSAGE', msg);
  }
  return {
    'X-AUTH-SIGNATURE': sig,
    'X-AUTH-MESSAGE': msg
  };
}

export async function dummyFetch() {
  await sleep(1000);
  return sampleData;
}

const catchError = (err: any) => {
  console.error('catchError', err, err?.response);
  return { error: { message: typeof err === 'object' ? err?.message : err }, status: err?.response?.status };
};

export const apiGet = async (path: string, query?: any) => {
  const queryStr = query ? '?' + qs.stringify(query) : '';
  try {
    const { data, status } = await axiosApi({
      url: `${API_BASE}${path}${queryStr}`,
      method: 'GET',
      headers: await getAuthHeaders()
    });
    return { result: data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    return { error, status };
  }
};

export const apiPost = async (path: string, query?: any, payload?: any) => {
  const queryStr = query ? '?' + qs.stringify(query) : '';
  try {
    const { data, status } = await axiosApi({
      url: `${API_BASE}${path}${queryStr}`,
      method: 'POST',
      headers: await getAuthHeaders(),
      data: payload
    });
    return { result: data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    return { error, status };
  }
};

export const apiDelete = async (path: string, query?: any) => {
  const queryStr = query ? '?' + qs.stringify(query) : '';
  try {
    const { data, status } = await axiosApi({
      url: `${API_BASE}${path}${queryStr}`,
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    return { result: data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    return { error, status };
  }
};
