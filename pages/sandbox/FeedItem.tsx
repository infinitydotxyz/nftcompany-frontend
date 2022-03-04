import { Box } from '@chakra-ui/layout';
import { AnimatePresence, motion } from 'framer-motion';
import { updateCollectionDoc } from 'utils/firebase/firebaseUtils';
import { initCounter } from 'utils/firebase/counterUtils';
import styles from './FeedItem.module.scss';
import { list } from '@chakra-ui/react';

initCounter();
// TODO:
// - Adi asked for changes.
// - looking into BigQuery extension and web console.
// - implementing likes
// + pagination: on scroll, fetch more events.

// + Basic Filter: by Type
// + Add UI Likes
// - BE: utils: to push new event

export type FeedEventType = 'COLL' | 'NFT' | 'TWEET';

export type TimestampObject = {
  seconds: number;
  nanoseconds: number;
};

export type FeedEvent = {
  id: string;
  type: FeedEventType;
  title: string;
  imageUrl?: string;
  likes: number;
  datetime: TimestampObject;
};

type Props = {
  event?: FeedEvent;
};

export default function FeedItem({ event }: Props) {
  if (!event) {
    return null;
  }
  // console.log('event.datetime.seconds', event.datetime.seconds * 1000);
  const dt = new Date(event?.datetime?.seconds * 1000).toLocaleString();
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Box p={4} border="1px solid #ccc" borderRadius={12} mb={4}>
          <Box mb={2} color="gray.400">
            {dt}
          </Box>
          {event.type}: {event.title}
          <Box mt={4}>
            <img src={event.imageUrl} />
          </Box>
          <Box
            color="blue.400"
            cursor="pointer"
            onClick={() => {
              updateCollectionDoc('feed/data/events', event.id, { likes: event.likes + 1 });
            }}
          >
            {event.likes} Like
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
