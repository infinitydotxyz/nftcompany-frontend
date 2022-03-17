import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Box } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/react';
import Head from 'next/head';
import Layout from 'containers/layout';

import { COLL_FEED, fetchMoreEvents, subscribe } from '../../src/utils/firestore/firestoreUtils';
import FeedItem, { FeedEvent, EventType } from '../../src/components/app/Feed/FeedItem';
import { FetchMore } from 'components/FetchMore/FetchMore';
import { CommentPanel } from 'components/app/Feed/CommentPanel';
import { PageHeader } from 'components/PageHeader';
import styles from './feed.module.scss';

type Filter = {
  type?: EventType;
};
let eventsInit = false;

export default function Feed() {
  const [currentPage, setCurrentPage] = useState(0);
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [newEvents, setNewEvents] = useState<FeedEvent[]>([]); // new feed events
  const [filter, setFilter] = useState<Filter>({});
  const [filteredEvents, setFilteredEvents] = useState<FeedEvent[]>([]);
  const [commentPanelEvent, setCommentPanelEvent] = useState<FeedEvent | null>(null); // to show Comments Panel for an Event.

  async function getEvents() {
    try {
      subscribe(COLL_FEED, filter, (type: string, data: FeedEvent) => {
        // console.log('--- change: ', type, data);
        if (type === 'added') {
          if (eventsInit === false) {
            setEvents((currentEvents) => [data, ...currentEvents]); // add initial feed events.
            setTimeout(() => {
              eventsInit = true;
            }, 3000);
          } else {
            setNewEvents((currentEvents) => [data, ...currentEvents]);
          }
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
  }, [filter]);

  useEffect(() => {
    let arr = events;
    if (filter.type) {
      arr = events.filter((ev) => ev.type === filter.type);
    }
    setFilteredEvents(arr);
  }, [events]);

  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <div>
        <div className="page-container">
          <PageHeader title="Activity Feed" />

          <Box mb={4}>
            <Select
              onChange={(ev) => {
                setEvents([]);
                setTimeout(() => {
                  eventsInit = false;
                  setNewEvents([]);
                  // triggers useEffect.
                  if (ev.target.value) {
                    setFilter({ type: ev.target.value as EventType });
                  } else {
                    setFilter({});
                  }
                }, 500);
              }}
            >
              <option value="">All</option>
              <option value="NFT_SALE">NFT Sales</option>
              <option value="TWEET">Tweets</option>
            </Select>
          </Box>

          {newEvents.length > 0 ? (
            <div
              className={styles.moreEvents}
              onClick={() => {
                setEvents((currentEvents) => [...newEvents, ...currentEvents]);
                setNewEvents([]);
              }}
            >
              Show {newEvents.length} more events.
            </div>
          ) : null}

          {filteredEvents.map((event: FeedEvent, idx: number) => {
            return (
              <FeedItem
                key={idx}
                event={event}
                onLike={(ev) => {
                  const foundEv = events.find((e) => e.id === ev.id);
                  if (foundEv?.likes !== undefined) {
                    foundEv.likes = foundEv.likes + 1;
                  }
                  setEvents([...events]);
                }}
                onComment={(ev) => {
                  const foundEv = events.find((e) => e.id === ev.id);
                  if (foundEv?.comments !== undefined) {
                    foundEv.comments = foundEv.comments + 1;
                  }
                  setEvents([...events]);
                }}
                onClickShowComments={(ev) => {
                  setCommentPanelEvent(ev);
                }}
              />
            );
          })}
        </div>

        {commentPanelEvent && (
          <CommentPanel
            event={commentPanelEvent}
            isOpen={!!commentPanelEvent}
            onClose={() => {
              setCommentPanelEvent(null);
            }}
          />
        )}

        <FetchMore
          currentPage={currentPage}
          onFetchMore={async () => {
            setCurrentPage(currentPage + 1);
            const arr = (await fetchMoreEvents(filter)) as EventType[];
            setEvents((currentEvents) => [...currentEvents, ...arr]);
          }}
        />
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Feed.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
