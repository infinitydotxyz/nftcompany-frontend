import { Icon } from '@chakra-ui/icons';
import { startsWith } from 'lodash';
import { startNewSession } from 'logrocket';
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
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
    </g>
  </Icon>
);

// view-source:https://upload.wikimedia.org/wikipedia/commons/7/70/Ethereum_logo.svg
export const EthToken = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="-2.77410003 -2.77410003 98.01820106 156.13971006" fill="none" {...props}>
    <g fill="currentColor">
      <path
        fillOpacity="1"
        fillRule="nonzero"
        opacity="0.60000598"
        stroke="none"
        d="M 46.22125,55.68413 0,76.69288 46.22125,104.01413 92.4425,76.69288 46.22125,55.68413 z"
      />
      <path
        fillOpacity="1"
        fillRule="nonzero"
        opacity="0.44999701"
        stroke="none"
        d="m 3.7e-4,76.6925 46.22125,27.32125 0,-48.33 L 46.22162,0 3.7e-4,76.6925 z"
      />
      <path
        fillOpacity="1"
        fillRule="nonzero"
        opacity="0.80000299"
        stroke="none"
        d="m 46.22125,0 0,55.68375 0,48.33 L 92.4425,76.6925 46.22125,0 z"
      />
      <path
        fillOpacity="1"
        fillRule="nonzero"
        opacity="0.44999701"
        stroke="none"
        d="m 3.7e-4,85.45725 46.22125,65.13375 0,-37.82625 L 3.7e-4,85.45725 z"
      />
      <path
        fillOpacity="1"
        fillRule="nonzero"
        opacity="0.80000299"
        stroke="none"
        d="m 46.22125,112.76525 0,37.82625 L 92.47,85.45775 46.22125,112.76525 z"
      />
    </g>
  </Icon>
);

export const WEthToken = (props: Record<string, unknown>): JSX.Element => (
  <span style={{ color: '#DA3979' }}>
    <EthToken />
  </span>
);

export const ImageIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
    </g>
  </Icon>
);

export const CartIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
    </g>
  </Icon>
);

export const OfferIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z" />
      <circle cx="6.5" cy="6.5" r="1.5" />
    </g>
  </Icon>
);

export const ImageSearchIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53 1.96 2.36 2.75-3.54L16.5 18zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89zM15.5 9C14.12 9 13 7.88 13 6.5S14.12 4 15.5 4 18 5.12 18 6.5 16.88 9 15.5 9z" />
    </g>
  </Icon>
);

export const MoneyIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.42 0 2.13.54 2.39 1.4.12.4.45.7.87.7h.3c.66 0 1.13-.65.9-1.27-.42-1.18-1.4-2.16-2.96-2.54V4.5c0-.83-.67-1.5-1.5-1.5S10 3.67 10 4.5v.66c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-1.65 0-2.5-.59-2.83-1.43-.15-.39-.49-.67-.9-.67h-.28c-.67 0-1.14.68-.89 1.3.57 1.39 1.9 2.21 3.4 2.53v.67c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-.65c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </g>
  </Icon>
);

export const AddCartIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2z" />
    </g>
  </Icon>
);

export const ShoppingBagIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
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
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M4 18h4c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm1 6h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1z" />
    </g>
  </Icon>
);

// ========================================================================================================

export const LeaderboardIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <rect fill="none" height="24" width="24" />
      <g>
        <path d="M6.5,21H3c-0.55,0-1-0.45-1-1V10c0-0.55,0.45-1,1-1h3.5c0.55,0,1,0.45,1,1v10C7.5,20.55,7.05,21,6.5,21z M13.75,3h-3.5 c-0.55,0-1,0.45-1,1v16c0,0.55,0.45,1,1,1h3.5c0.55,0,1-0.45,1-1V4C14.75,3.45,14.3,3,13.75,3z M21,11h-3.5c-0.55,0-1,0.45-1,1v8 c0,0.55,0.45,1,1,1H21c0.55,0,1-0.45,1-1v-8C22,11.45,21.55,11,21,11z" />
      </g>
    </g>
  </Icon>
);

export const AwardIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <g>
        <rect fill="none" height="24" width="24" />
        <rect fill="none" height="24" width="24" />
      </g>

      <g>
        <path d="M17,10.43V3c0-0.55-0.45-1-1-1H8C7.45,2,7,2.45,7,3v7.43c0,0.35,0.18,0.68,0.49,0.86l4.18,2.51l-0.99,2.34l-2.22,0.19 C8,16.37,7.82,16.92,8.16,17.21l1.69,1.46l-0.51,2.18c-0.1,0.43,0.37,0.77,0.75,0.54L12,20.23l1.91,1.15 c0.38,0.23,0.85-0.11,0.75-0.54l-0.51-2.18l1.69-1.46c0.33-0.29,0.16-0.84-0.29-0.88l-2.22-0.19l-0.99-2.34l4.18-2.51 C16.82,11.11,17,10.79,17,10.43z M13,12.23l-1,0.6l-1-0.6V3h2V12.23z" />
      </g>
    </g>
  </Icon>
);

export const AlarmIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
    </g>
  </Icon>
);

export const AnalyticsIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <rect fill="none" height="24" width="24" />
      <g>
        <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z" />
        <rect height="5" width="2" x="7" y="12" />
        <rect height="10" width="2" x="15" y="7" />
        <rect height="3" width="2" x="11" y="14" />
        <rect height="2" width="2" x="11" y="10" />
      </g>
    </g>
  </Icon>
);

export const StatsIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <rect fill="none" height="24" width="24" />
      <g>
        <path d="M19.88,18.47c0.44-0.7,0.7-1.51,0.7-2.39c0-2.49-2.01-4.5-4.5-4.5s-4.5,2.01-4.5,4.5s2.01,4.5,4.49,4.5 c0.88,0,1.7-0.26,2.39-0.7L21.58,23L23,21.58L19.88,18.47z M16.08,18.58c-1.38,0-2.5-1.12-2.5-2.5c0-1.38,1.12-2.5,2.5-2.5 s2.5,1.12,2.5,2.5C18.58,17.46,17.46,18.58,16.08,18.58z M15.72,10.08c-0.74,0.02-1.45,0.18-2.1,0.45l-0.55-0.83l-3.8,6.18 l-3.01-3.52l-3.63,5.81L1,17l5-8l3,3.5L13,6C13,6,15.72,10.08,15.72,10.08z M18.31,10.58c-0.64-0.28-1.33-0.45-2.05-0.49 c0,0,5.12-8.09,5.12-8.09L23,3.18L18.31,10.58z" />
      </g>
    </g>
  </Icon>
);

export const MovingIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <rect fill="none" height="24" width="24" />
      <path d="M19.71,9.71L22,12V6h-6l2.29,2.29l-4.17,4.17c-0.39,0.39-1.02,0.39-1.41,0l-1.17-1.17c-1.17-1.17-3.07-1.17-4.24,0L2,16.59 L3.41,18l5.29-5.29c0.39-0.39,1.02-0.39,1.41,0l1.17,1.17c1.17,1.17,3.07,1.17,4.24,0L19.71,9.71z" />
    </g>
  </Icon>
);

export const GiftCardIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
    </g>
  </Icon>
);

export const StarCircleIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
    </g>
  </Icon>
);

export const PendingIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <rect fill="none" height="24" width="24" />
      <path d="M17,12c-2.76,0-5,2.24-5,5s2.24,5,5,5c2.76,0,5-2.24,5-5S19.76,12,17,12z M18.65,19.35l-2.15-2.15V14h1v2.79l1.85,1.85 L18.65,19.35z M18,3h-3.18C14.4,1.84,13.3,1,12,1S9.6,1.84,9.18,3H6C4.9,3,4,3.9,4,5v15c0,1.1,0.9,2,2,2h6.11 c-0.59-0.57-1.07-1.25-1.42-2H6V5h2v3h8V5h2v5.08c0.71,0.1,1.38,0.31,2,0.6V5C20,3.9,19.1,3,18,3z M12,5c-0.55,0-1-0.45-1-1 c0-0.55,0.45-1,1-1c0.55,0,1,0.45,1,1C13,4.55,12.55,5,12,5z" />
    </g>
  </Icon>
);

export const MeditationIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <circle cx="12" cy="6" r="2" />
        <path d="M21,16v-2c-2.24,0-4.16-0.96-5.6-2.68l-1.34-1.6C13.68,9.26,13.12,9,12.53,9h-1.05c-0.59,0-1.15,0.26-1.53,0.72l-1.34,1.6 C7.16,13.04,5.24,14,3,14v2c2.77,0,5.19-1.17,7-3.25V15l-3.88,1.55C5.45,16.82,5,17.48,5,18.21C5,19.2,5.8,20,6.79,20H9v-0.5 c0-1.38,1.12-2.5,2.5-2.5h3c0.28,0,0.5,0.22,0.5,0.5S14.78,18,14.5,18h-3c-0.83,0-1.5,0.67-1.5,1.5V20h7.21 C18.2,20,19,19.2,19,18.21c0-0.73-0.45-1.39-1.12-1.66L14,15v-2.25C15.81,14.83,18.23,16,21,16z" />
      </g>
    </g>
  </Icon>
);

export const DarkModeIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <rect fill="none" height="24" width="24" />
      <path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
    </g>
  </Icon>
);

export const LightModeIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <rect fill="none" height="24" width="24" />
      <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
    </g>
  </Icon>
);

export const CheckShieldIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={8} viewBox="0 0 24 24" {...props}>
    <g fill="none">
      <path
        d="M9.05078 11.8701L10.6608 13.4801L14.9608 9.18005"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M20.5902 7.12006C20.5902 5.89006 19.6502 4.53006 18.5002 4.10006L13.5102 2.23006C12.6802 1.92006 11.3202 1.92006 10.4902 2.23006L5.50016 4.11006C4.35016 4.54006 3.41016 5.90006 3.41016 7.12006V14.5501C3.41016 15.7301 4.19016 17.2801 5.14016 17.9901L9.44016 21.2001C10.8502 22.2601 13.1702 22.2601 14.5802 21.2001L18.8802 17.9901C19.8302 17.2801 20.6102 15.7301 20.6102 14.5501V11.0301"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </Icon>
);

export const MoreVertIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon boxSize={8} viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </g>
  </Icon>
);

export const SignInIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z" />
      </g>
    </g>
  </Icon>
);

export const StarIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
    </g>
  </Icon>
);

export const AccountIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <g>
        <path d="M0,0h24v24H0V0z" fill="none" />
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
      </g>
    </g>
  </Icon>
);

export const CollectionsIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
    </g>
  </Icon>
);

export const ExploreIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
    </g>
  </Icon>
);

export const ShareIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
    </g>
  </Icon>
);

export const ListViewIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z" />
    </g>
  </Icon>
);

export const IconViewIcon = (props: Record<string, unknown>): JSX.Element => (
  <Icon viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <g>
          <rect height="8" width="8" x="3" y="3" />
          <rect height="8" width="8" x="3" y="13" />
          <rect height="8" width="8" x="13" y="3" />
          <rect height="8" width="8" x="13" y="13" />
        </g>
      </g>
    </g>
  </Icon>
);
