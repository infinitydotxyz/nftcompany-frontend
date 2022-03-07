import { Box } from '@chakra-ui/layout';
import { AnimatePresence, motion } from 'framer-motion';
import { addUserComments, addUserLike } from 'utils/firestore/firestoreUtils';
import { useAppContext } from 'utils/context/AppContext';

export type FeedEventType = 'COLL' | 'NFT' | 'TWEET';

export type FeedEvent = {
  id: string;
  type: FeedEventType;
  title: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: number;
};

type Props = {
  event?: FeedEvent;
  onLike?: (event: FeedEvent) => void;
  onComment?: (event: FeedEvent) => void;
};

export default function FeedItem({ event, onLike, onComment }: Props) {
  const { user } = useAppContext();

  if (!event) {
    return null;
  }

  const dt = new Date(event?.timestamp).toLocaleString();
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
          <Box display="flex">
            <Box
              color="blue.400"
              cursor="pointer"
              onClick={() => {
                if (user && user?.account) {
                  addUserLike(event.id, user?.account, () => {
                    if (onLike) {
                      onLike(event);
                    }
                  });
                }
              }}
            >
              {event.likes} Like(s)
            </Box>
            <Box
              color="blue.400"
              cursor="pointer"
              onClick={() => {
                if (user && user?.account) {
                  addUserComments(event.id, user?.account, 'Dummy comment ' + Math.random(), () => {
                    if (onComment) {
                      onComment(event);
                    }
                  });
                }
              }}
            >
              &nbsp; - {event.comments} Comment(s)
            </Box>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
