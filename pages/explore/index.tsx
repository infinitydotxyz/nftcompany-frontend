import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/react';
// import { Select } from '@chakra-ui/react';
import CardList from 'components/Card/CardList';
import FilterPanel, { Filter } from 'components/FilterPanel/FilterPanel';
import { FilterIcon } from 'components/Icons/Icons';
import { sampleData, dummyFetch } from '../../src/utils/apiUtil';
import styles from '../../styles/Dashboard.module.scss';
import { getListings } from 'services/Listings.service';
import { CardData } from 'components/Card/Card';

export default function Dashboard() {
  const [tabIndex, setTabIndex] = useState(1);
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [listedNfts, setListedNfts] = useState<CardData[]>([]);

  const title = React.useMemo(() => {
    switch (tabIndex) {
      case 1:
        return 'Hot Bids 🔥';
        break;
      case 2:
        return 'Artistic 🎨';
        break;
      case 3:
        return 'Coins 🪙';
        break;
      case 4:
        return 'Games 🎮';
        break;
      case 5:
        return 'Music 🎵';
        break;

      default:
        break;
    }
  }, [tabIndex]);
  React.useEffect(() => {
    getNftListings();
  }, []);

  const getNftListings = async (filter?: Filter) => {
    await setIsFetching(true);
    const response = await getListings(filter);
    setListedNfts(response);
    await setIsFetching(false);
  };

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">
              <div className="tg-title">{title}</div>
            </div>

            <div className="center">
              {/* <ul className="links">
                <li>
                  <a onClick={() => setTabIndex(1)} className={tabIndex === 1 ? 'active' : ''} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14.9303 2.5V8.4C14.9303 8.84 14.4103 9.06 14.0903 8.77L12.3403 7.16C12.1503 6.98 11.8503 6.98 11.6603 7.16L9.91031 8.76C9.59031 9.06 9.07031 8.83 9.07031 8.4V2.5C9.07031 2.22 9.29031 2 9.57031 2H14.4303C14.7103 2 14.9303 2.22 14.9303 2.5Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M16.98 2.05891C16.69 2.01891 16.43 2.26891 16.43 2.55891V8.57891C16.43 9.33891 15.98 10.0289 15.28 10.3389C14.58 10.6389 13.77 10.5089 13.21 9.98891L12.34 9.18891C12.15 9.00891 11.86 9.00891 11.66 9.18891L10.79 9.98891C10.43 10.3289 9.96 10.4989 9.49 10.4989C9.23 10.4989 8.97 10.4489 8.72 10.3389C8.02 10.0289 7.57 9.33891 7.57 8.57891V2.55891C7.57 2.26891 7.31 2.01891 7.02 2.05891C4.22 2.40891 3 4.29891 3 6.99891V16.9989C3 19.9989 4.5 21.9989 8 21.9989H16C19.5 21.9989 21 19.9989 21 16.9989V6.99891C21 4.29891 19.78 2.40891 16.98 2.05891ZM17.5 18.7489H9C8.59 18.7489 8.25 18.4089 8.25 17.9989C8.25 17.5889 8.59 17.2489 9 17.2489H17.5C17.91 17.2489 18.25 17.5889 18.25 17.9989C18.25 18.4089 17.91 18.7489 17.5 18.7489ZM17.5 14.7489H13.25C12.84 14.7489 12.5 14.4089 12.5 13.9989C12.5 13.5889 12.84 13.2489 13.25 13.2489H17.5C17.91 13.2489 18.25 13.5889 18.25 13.9989C18.25 14.4089 17.91 14.7489 17.5 14.7489Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    All
                  </a>
                </li>
                <li>
                  <a onClick={() => setTabIndex(2)} className={tabIndex === 2 ? 'active' : ''} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M16.44 3.10156C14.63 3.10156 13.01 3.98156 12 5.33156C10.99 3.98156 9.37 3.10156 7.56 3.10156C4.49 3.10156 2 5.60156 2 8.69156C2 9.88156 2.19 10.9816 2.52 12.0016C4.1 17.0016 8.97 19.9916 11.38 20.8116C11.72 20.9316 12.28 20.9316 12.62 20.8116C15.03 19.9916 19.9 17.0016 21.48 12.0016C21.81 10.9816 22 9.88156 22 8.69156C22 5.60156 19.51 3.10156 16.44 3.10156Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Arts
                  </a>
                </li>
                <li>
                  <a onClick={() => setTabIndex(3)} className={tabIndex === 3 ? 'active' : ''} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14.9693 12.75H14.1993H9.5293V15.58H10.8393H14.9693C15.9193 15.58 16.6993 14.94 16.6993 14.16C16.6993 13.38 15.9193 12.75 14.9693 12.75Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.97 17.08H13.32V18.5C13.32 18.91 12.98 19.25 12.57 19.25C12.16 19.25 11.82 18.91 11.82 18.5V17.08H10.84H10.61V18.5C10.61 18.91 10.27 19.25 9.86 19.25C9.45 19.25 9.11 18.91 9.11 18.5V17.08H8.78H7.05C6.64 17.08 6.3 16.74 6.3 16.33C6.3 15.92 6.64 15.58 7.05 15.58H8.03V12V8.42H7.05C6.64 8.42 6.3 8.08 6.3 7.67C6.3 7.26 6.64 6.92 7.05 6.92H8.78H9.11V5.5C9.11 5.09 9.45 4.75 9.86 4.75C10.27 4.75 10.61 5.09 10.61 5.5V6.92H10.84H11.82V5.5C11.82 5.09 12.16 4.75 12.57 4.75C12.98 4.75 13.32 5.09 13.32 5.5V6.92H14.2C15.75 6.92 17.12 8.28 17.12 9.84C17.12 10.51 16.88 11.12 16.5 11.62C17.51 12.11 18.2 13.07 18.2 14.18C18.2 15.77 16.75 17.08 14.97 17.08Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M15.6193 9.83016C15.6193 9.17016 14.9993 8.41016 14.1993 8.41016H10.8393H9.5293V11.2402H14.1993C14.9793 11.2502 15.6193 10.6102 15.6193 9.83016Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Crypto
                  </a>
                </li>
                <li>
                  <a onClick={() => setTabIndex(4)} className={tabIndex === 4 ? 'active' : ''} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M16.65 5.71875H7.35C4.4 5.71875 2 8.11875 2 11.0687V16.6488C2 19.5988 4.4 21.9988 7.35 21.9988H16.65C19.6 21.9988 22 19.5988 22 16.6488V11.0687C22 8.11875 19.6 5.71875 16.65 5.71875ZM14.5 12.0188C14.5 11.4688 14.95 11.0188 15.5 11.0188C16.05 11.0188 16.5 11.4688 16.5 12.0188C16.5 12.5688 16.05 13.0287 15.5 13.0287C14.95 13.0287 14.5 12.5888 14.5 12.0388V12.0188ZM10.13 16.0688C9.98 16.2188 9.79 16.2888 9.6 16.2888C9.41 16.2888 9.22 16.2188 9.07 16.0688L8.04 15.0387L7.05 16.0288C6.9 16.1788 6.71 16.2488 6.52 16.2488C6.33 16.2488 6.14 16.1788 5.99 16.0288C5.7 15.7388 5.7 15.2587 5.99 14.9688L6.98 13.9788L6.02 13.0188C5.73 12.7288 5.73 12.2488 6.02 11.9588C6.31 11.6688 6.79 11.6688 7.08 11.9588L8.04 12.9188L9.03 11.9288C9.32 11.6388 9.8 11.6388 10.09 11.9288C10.38 12.2188 10.38 12.6988 10.09 12.9887L9.1 13.9788L10.13 15.0088C10.42 15.2988 10.42 15.7788 10.13 16.0688ZM13.54 14.9988C12.99 14.9988 12.53 14.5488 12.53 13.9988C12.53 13.4488 12.97 12.9988 13.52 12.9988H13.54C14.09 12.9988 14.54 13.4488 14.54 13.9988C14.54 14.5488 14.1 14.9988 13.54 14.9988ZM15.5 16.9688C14.95 16.9688 14.5 16.5288 14.5 15.9788V15.9587C14.5 15.4087 14.95 14.9587 15.5 14.9587C16.05 14.9587 16.5 15.4087 16.5 15.9587C16.5 16.5087 16.06 16.9688 15.5 16.9688ZM17.48 14.9988C16.93 14.9988 16.47 14.5488 16.47 13.9988C16.47 13.4488 16.91 12.9988 17.46 12.9988H17.48C18.03 12.9988 18.48 13.4488 18.48 13.9988C18.48 14.5488 18.04 14.9988 17.48 14.9988Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M13.6394 2.71L13.6294 3.65C13.6194 4.53 12.8894 5.26 11.9994 5.26C11.8494 5.26 11.7594 5.36 11.7594 5.49C11.7594 5.62 11.8594 5.72 11.9894 5.72H10.3794C10.3694 5.65 10.3594 5.57 10.3594 5.49C10.3594 4.59 11.0894 3.86 11.9794 3.86C12.1294 3.86 12.2294 3.76 12.2294 3.63L12.2394 2.69C12.2494 2.31 12.5594 2 12.9394 2H12.9494C13.3394 2 13.6394 2.32 13.6394 2.71Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Games
                  </a>
                </li>
                <li>
                  <a onClick={() => setTabIndex(5)} className={tabIndex === 5 ? 'active' : ''} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20.8894 5.1786V16.4786C20.8894 18.4586 19.2794 20.0686 17.2994 20.0686C15.3294 20.0686 13.7094 18.4586 13.7094 16.4786C13.7094 14.5086 15.3294 12.8986 17.2994 12.8986C18.1394 12.8986 18.8894 13.1886 19.4994 13.6686V7.7186L10.2894 10.3386V18.4086C10.2894 20.3886 8.66937 21.9986 6.69937 21.9986C4.71937 21.9986 3.10938 20.3886 3.10938 18.4086C3.10938 16.4386 4.71937 14.8286 6.69937 14.8286C7.52938 14.8286 8.27938 15.1186 8.88938 15.5886V6.7486C8.88938 5.2786 9.77938 4.1386 11.1894 3.7586L16.9694 2.1786C18.1394 1.8586 19.1294 1.9686 19.8294 2.5086C20.5394 3.0386 20.8894 3.9386 20.8894 5.1786Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Music
                  </a>
                </li>
              </ul> */}
            </div>

            <div className="left">
              <div className="center" style={{ flex: 1, marginRight: 30 }}>
                <ul className="links">
                  <li>
                    <a className="active cpointer" onClick={() => setFilterShowed(!filterShowed)}>
                      Filter <FilterIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <FilterPanel
            isExpanded={filterShowed}
            onChange={async (filter) => {
              getNftListings(filter);
            }}
          />

          {isFetching ? <Spinner size="md" color="gray.800" /> : <CardList data={listedNfts} />}
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Dashboard.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
