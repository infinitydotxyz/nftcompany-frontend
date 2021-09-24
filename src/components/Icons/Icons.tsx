import { Icon } from '@chakra-ui/icons';
import React from 'react';

// Find icons here (download source is easier to view them all)
// https://github.com/mui-org/material-ui/tree/master/packages/mui-icons-material/material-icons

export const FilterIcon = (): JSX.Element => {
  return (
    <svg
      fill="#fff"
      enableBackground="new 0 0 512 512"
      height="16"
      width="16"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="m187.304 252.717c8.045 11.642 5.64 1.941 5.64 233.997 0 20.766 23.692 32.651 40.39 20.23 71.353-53.797 85.609-58.456 85.609-83.619 0-169.104-1.971-159.594 5.64-170.608l115.869-157.718h-369.016z" />
        <path d="m484.221 12.86c-4.14-7.93-12.26-12.86-21.199-12.86h-414.156c-19.305 0-30.664 21.777-19.59 37.6.091.152-1.257-1.693 20.12 27.4h413.095c18.217-24.793 30.394-35.505 21.73-52.14z" />
      </g>
    </svg>
  );
};

export const ListIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={6} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
    </g>
  </Icon>
);

export const EthToken = (props: Record<string, unknown>): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" {...props}>
    <script />
    <script />
    <script />
    <path
      d="M16.3576 0.666687L16.0095 1.85009V36.1896L16.3576 36.5371L32.2976 27.115L16.3576 0.666687Z"
      fill="#343434"
    />
    <path d="M16.3578 0.666687L0.417816 27.115L16.3578 36.5372V19.8699V0.666687Z" fill="#8C8C8C" />
    <path d="M16.3575 39.5552L16.1613 39.7944V52.0268L16.3575 52.6L32.307 30.1378L16.3575 39.5552Z" fill="#3C3C3B" />
    <path d="M16.3578 52.5998V39.5551L0.417816 30.1377L16.3578 52.5998Z" fill="#8C8C8C" />
    <path d="M16.3575 36.537L32.2973 27.1151L16.3575 19.8699V36.537Z" fill="#141414" />
    <path d="M0.417816 27.1151L16.3576 36.537V19.8699L0.417816 27.1151Z" fill="#393939" />
    <script type="text/javascript" src="chrome-extension://fnnegphlobjdpkhecapkijjdkgcjhkib/inject-script.js" />
    <script />
  </svg>
);

export const WEthToken = (props: Record<string, unknown>): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" {...props}>
    <path
      d="M16.8498 0.666687L16.4974 1.85009V36.1896L16.8498 36.5371L32.9842 27.115L16.8498 0.666687Z"
      fill="#DA3979"
    />
    <path d="M16.85 0.666687L0.715607 27.115L16.85 36.5372V19.8699V0.666687Z" fill="#E781A9" />
    <path d="M16.8497 39.5552L16.6511 39.7944V52.0268L16.8497 52.6L32.9937 30.1378L16.8497 39.5552Z" fill="#DA3979" />
    <path d="M16.85 52.5998V39.5551L0.715607 30.1377L16.85 52.5998Z" fill="#E781A9" />
    <path d="M16.8497 36.537L32.9838 27.1151L16.8497 19.8699V36.537Z" fill="#671334" />
    <path d="M0.715607 27.1151L16.8498 36.537V19.8699L0.715607 27.1151Z" fill="#DA3979" />
    <script
      type="text/javascript"
      src="chrome-extension://fnnegphlobjdpkhecapkijjdkgcjhkib/inject-script.js"
    />
    <script />
  </svg>
);

export const ImageIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
    </g>
  </Icon>
);

export const CartIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
    </g>
  </Icon>
);

export const OfferIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z" />
      <circle cx="6.5" cy="6.5" r="1.5" />
    </g>
  </Icon>
);

export const ImageSearchIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53 1.96 2.36 2.75-3.54L16.5 18zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89zM15.5 9C14.12 9 13 7.88 13 6.5S14.12 4 15.5 4 18 5.12 18 6.5 16.88 9 15.5 9z" />
    </g>
  </Icon>
);

export const MoneyIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.42 0 2.13.54 2.39 1.4.12.4.45.7.87.7h.3c.66 0 1.13-.65.9-1.27-.42-1.18-1.4-2.16-2.96-2.54V4.5c0-.83-.67-1.5-1.5-1.5S10 3.67 10 4.5v.66c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-1.65 0-2.5-.59-2.83-1.43-.15-.39-.49-.67-.9-.67h-.28c-.67 0-1.14.68-.89 1.3.57 1.39 1.9 2.21 3.4 2.53v.67c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-.65c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </g>
  </Icon>
);

export const AddCartIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2z" />
    </g>
  </Icon>
);

export const ShoppingBagIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <rect fill="none" height="24" width="24" />
      <path d="M18,6h-2c0-2.21-1.79-4-4-4S8,3.79,8,6H6C4.9,6,4,6.9,4,8v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8C20,6.9,19.1,6,18,6z M12,4c1.1,0,2,0.9,2,2h-4C10,4.9,10.9,4,12,4z M18,20H6V8h2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V8h4v2c0,0.55,0.45,1,1,1s1-0.45,1-1V8 h2V20z" />
    </g>
  </Icon>
);

export const UnderConstructionIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={200} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <g>
        <rect
          height="8.48"
          transform="matrix(0.7071 -0.7071 0.7071 0.7071 -6.8717 17.6255)"
          width="3"
          x="16.34"
          y="12.87"
        />
      </g>

      <path d="M17.5,10c1.93,0,3.5-1.57,3.5-3.5c0-0.58-0.16-1.12-0.41-1.6l-2.7,2.7L16.4,6.11l2.7-2.7C18.62,3.16,18.08,3,17.5,3 C15.57,3,14,4.57,14,6.5c0,0.41,0.08,0.8,0.21,1.16l-1.85,1.85l-1.78-1.78l0.71-0.71L9.88,5.61L12,3.49 c-1.17-1.17-3.07-1.17-4.24,0L4.22,7.03l1.41,1.41H2.81L2.1,9.15l3.54,3.54l0.71-0.71V9.15l1.41,1.41l0.71-0.71l1.78,1.78 l-7.41,7.41l2.12,2.12L16.34,9.79C16.7,9.92,17.09,10,17.5,10z" />
    </g>
  </Icon>
);

export const SortIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M4 18h4c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm1 6h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1z" />
    </g>
  </Icon>
);
