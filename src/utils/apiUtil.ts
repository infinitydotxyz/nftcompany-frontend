import axios, { AxiosInstance } from 'axios';
import { errorToast } from 'components/Toast/Toast';
import { ethers } from 'ethers';
import qs from 'query-string';
import { API_BASE, LOGIN_MESSAGE } from './constants';
import { getAccount, getProvider, getWeb3 } from './ethersUtil';
import { WalletConnectProxy } from './WalletConnectProxy';
const personalSignAsync = require('../../opensea/utils/utils').personalSignAsync;

const axiosApi: AxiosInstance = axios.create({
  headers: {}
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function saveAuthHeaders(address: string, provider: ethers.providers.ExternalProvider) {
  if (!address) {
    console.log('use deleteAuthHeaders is you want to sign out');
    return;
  }

  const localStorage = window.localStorage;
  const user = address.trim().toLowerCase();
  const currentUser = localStorage.getItem('CURRENT_USER');

  if (currentUser !== user) {
    const web3 = getWeb3(provider);
    let sign;
    console.log(provider);
    if ((provider as any).isWalletConnect) {
      sign = await (provider as any as WalletConnectProxy).sign(LOGIN_MESSAGE);
    } else {
      sign = await personalSignAsync(web3, LOGIN_MESSAGE, address);
    }

    const sig = JSON.stringify(sign);
    localStorage.setItem('CURRENT_USER', user);
    localStorage.setItem('X-AUTH-SIGNATURE', sig);
    localStorage.setItem('X-AUTH-MESSAGE', LOGIN_MESSAGE);
  }
}

export async function deleteAuthHeaders() {
  const localStorage = window.localStorage;

  localStorage.removeItem('CURRENT_USER');
  localStorage.removeItem('X-AUTH-SIGNATURE');
  localStorage.removeItem('X-AUTH-MESSAGE');

  // need to tell metamask? not fully working SNG
}

export async function getAuthHeaders(provider?: ethers.providers.ExternalProvider, doNotAttemptLogin?: boolean) {
  // fetch auth signature and message from local storage
  const localStorage = window.localStorage;
  let sig = localStorage.getItem('X-AUTH-SIGNATURE') || '';
  const msg = localStorage.getItem('X-AUTH-MESSAGE') || LOGIN_MESSAGE;
  // if they are empty, resign and store
  let account;
  if (!sig && !doNotAttemptLogin) {
    console.log('No auth found, re logging in');
    const selectedProvider = provider ?? getProvider();
    const web3 = getWeb3(selectedProvider);
    console.log({ web3 });
    if (web3) {
      let sign;
      account = await getAccount(selectedProvider);
      console.log(`signing with account: ${account}`);
      console.log(provider);
      if ((provider as any).isWalletConnect) {
        const proxy = new WalletConnectProxy(provider as any);
        sign = await proxy.sign(LOGIN_MESSAGE);
      } else {
        sign = await personalSignAsync(web3, LOGIN_MESSAGE, account);
      }
      // const sign = await personalSignAsync(web3, msg, account);
      sig = JSON.stringify(sign);
      console.log(`signature: ${sig}`);
      localStorage.setItem('CURRENT_USER', account);
      localStorage.setItem('X-AUTH-SIGNATURE', sig);
      localStorage.setItem('X-AUTH-MESSAGE', msg);
    }
  }
  return {
    ...(account ? { CURRENT_USER: account } : {}),
    'X-AUTH-SIGNATURE': sig,
    'X-AUTH-MESSAGE': msg
  };
}

export async function dummyFetch(mockData = []) {
  await sleep(1000);
  return mockData;
}

const catchError = (err: any) => {
  console.error('catchError', err, err?.response);
  return { error: { message: typeof err === 'object' ? err?.message : err }, status: err?.response?.status };
};

export const apiGet = async (path: string, query?: any, options?: any, doNotAttemptLogin?: boolean) => {
  const queryStr = query ? '?' + qs.stringify(query) : '';
  try {
    const requiresAuth = path.indexOf('/u/') >= 0;

    let authHeaders = {};
    if (requiresAuth) {
      authHeaders = await getAuthHeaders(undefined, doNotAttemptLogin);
    }

    const { data, status } = await axiosApi({
      url: path.startsWith('http') ? path : `${API_BASE}${path}${queryStr}`,
      method: 'GET',
      headers: authHeaders,
      ...options
    });
    return { result: data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    if (status === 401) {
      errorToast('Unauthorized');
      return { error: new Error('Unauthorized'), status };
    }
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
    if (status === 429) {
      errorToast("You've been rate limited, please try again in a few minutes");
    }
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
