import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Box } from '@chakra-ui/layout';
import { Select, Button } from '@chakra-ui/react';
import Head from 'next/head';
import Layout from 'containers/layout';

import { fetchMoreEvents, subscribe } from '../../src/utils/firebase/firebaseUtils';
import FeedItem, { FeedEvent, FeedEventType } from './FeedItem';
import { FetchMore } from 'components/FetchMore/FetchMore';

type Filter = {
  type?: FeedEventType;
};

export default function Sandbox() {
  const [currentPage, setCurrentPage] = useState(0);
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [filter, setFilter] = useState<Filter>({});
  const [filteredEvents, setFilteredEvents] = useState<FeedEvent[]>([]);

  async function getEvents() {
    try {
      subscribe('feed/data/events', (type: string, data: FeedEvent) => {
        // console.log('--- change: ', type, data);
        if (type === 'added') {
          setEvents((currentEvents) => [data, ...currentEvents]);
        } else {
          setEvents((currentEvents) => [...currentEvents, data]);
        }
      });
    } catch (err) {
      console.log('ERR: ', err);
    }
  }

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    let arr = events;
    if (filter.type) {
      arr = events.filter((ev) => ev.type === filter.type);
    }
    setFilteredEvents(arr);
  }, [filter, events]);

  return (
    <>
      <Head>
        <title>Sandbox</title>
      </Head>
      <div>
        <div className="page-container">
          <Box mb={4}>Activity Feed</Box>

          <Box mb={4}>
            <Select
              onChange={(ev) => {
                setFilter({ type: ev.target.value as FeedEventType });
              }}
            >
              <option value="">All</option>
              <option value="COLL">Collection</option>
              <option value="TWEET">Tweets</option>
            </Select>
          </Box>

          {filteredEvents.map((event: FeedEvent, idx: number) => {
            return <FeedItem key={idx} event={event} />;
          })}
        </div>

        <FetchMore
          currentPage={currentPage}
          onFetchMore={async () => {
            setCurrentPage(currentPage + 1);
            const arr = (await fetchMoreEvents()) as FeedEvent[];
            setEvents((currentEvents) => [...currentEvents, ...arr]);
          }}
        />
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Sandbox.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
