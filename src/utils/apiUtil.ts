import axios, { AxiosInstance } from 'axios';
import qs from 'query-string';
import { API_BASE } from './constants';
import { getAccount, getWeb3 } from './ethersUtil';
const personalSignAsync = require('../../opensea/utils/utils').personalSignAsync;

const axiosApi: AxiosInstance = axios.create({
  headers: {}
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function saveAuthHeaders(address: string) {
  if (!address) {
    console.log('use deleteAuthHeaders is you want to sign out');
    return;
  }

  const localStorage = window.localStorage;
  const user = address.trim().toLowerCase();
  const currentUser = localStorage.getItem('CURRENT_USER');

  if (currentUser !== user) {
    const msg = 'LOGIN';
    const sign = await personalSignAsync(getWeb3(), msg, address);
    const sig = JSON.stringify(sign);
    localStorage.setItem('CURRENT_USER', user);
    localStorage.setItem('X-AUTH-SIGNATURE', sig);
    localStorage.setItem('X-AUTH-MESSAGE', msg);
  }
}

export async function deleteAuthHeaders() {
  const localStorage = window.localStorage;

  localStorage.removeItem('CURRENT_USER');
  localStorage.removeItem('X-AUTH-SIGNATURE');
  localStorage.removeItem('X-AUTH-MESSAGE');

  // need to tell metamask? not fully working SNG
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

export async function dummyFetch(mockData = []) {
  await sleep(1000);
  return mockData;
}

const catchError = (err: any) => {
  console.error('catchError', err, err?.response);
  return { error: { message: typeof err === 'object' ? err?.message : err }, status: err?.response?.status };
};

export const apiGet = async (path: string, query?: any, options?: any) => {
  const queryStr = query ? '?' + qs.stringify(query) : '';
  try {
    const { data, status } = await axiosApi({
      url: path.startsWith('http') ? path : `${API_BASE}${path}${queryStr}`,
      method: 'GET',
      headers: path.indexOf('/u/') >= 0 ? await getAuthHeaders() : {},
      ...options
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
