import { format } from 'timeago.js';
import { Box } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { addUserLike } from 'utils/firestore/firestoreUtils';
import { useAppContext } from 'utils/context/AppContext';
import { ChatIcon } from '@chakra-ui/icons';
import { AiOutlineLike } from 'react-icons/ai';
import { ellipsisString } from 'utils/commonUtil';
import { NftSaleEvent } from '@infinityxyz/lib/types/core/feed';
import { BaseFeedEvent, FeedEventType } from '@infinityxyz/lib/types/core/feed/FeedEvent';
import NftImage from './NftImage';

const ItemHeader = ({ event }: { event: FeedEvent }) => {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      <Image p={4} border="1px solid lightgray" alt="" borderRadius="50%" mr={2} />
      <Box>
        <Box display="flex">
          <Box fontWeight="500" mr={6}>
            {event.type === 'NFT_SALE' && (event.name || ellipsisString(event.collectionAddress))}
            {event.type === 'TWEET' && event.userDisplayName}
          </Box>
          <Box color="gray.500" title={new Date(event.timestamp).toLocaleString()}>
            {format(event.timestamp)}
          </Box>
        </Box>
        <Box display="flex" color="gray.500">
          {event.type === 'NFT_SALE' && 'Sale'}
          {event.type === 'TWEET' && 'Tweet'}
        </Box>
      </Box>
    </Box>
  );
};

const TweetEvent = ({ event }: { event: FeedEvent }) => {
  return (
    <div>
      {event.title}
      {event.type === 'TWEET' && (
        <Box mt={4}>
          <img src={event.image} alt="" />
        </Box>
      )}
    </div>
  );
};

const SaleEvent = ({ event }: { event: FeedEvent }) => {
  return (
    <Box display="flex" alignItems="center" backgroundColor="rgb(245, 245, 245, 1)" borderRadius={14} p={4} mt={4}>
      <NftImage
        tokenAddress={event.collectionAddress ?? ''}
        tokenId={event.tokenId ?? ''}
        src={event.image}
        border="1px solid lightgray"
        width={20}
        height={20}
        borderRadius={14}
        mr={8}
      />
      <Box display="flex" width="100%">
        <Box width="50%">
          <Box>Buyer</Box>
          <Box fontWeight={500} title={event.buyerDisplayName || event.buyer}>
            {ellipsisString(event.buyerDisplayName || event.buyer)}
          </Box>
        </Box>
        <Box width="50%">
          <Box>Price</Box>
          <Box fontWeight={500}>{event.price} ETH</Box>
        </Box>
      </Box>
    </Box>
  );
};

export type EventType = FeedEventType & 'TWEET';

export type FeedEvent = BaseFeedEvent &
  NftSaleEvent & {
    id?: string;
    type: EventType;
    userDisplayName?: string;
  };

type Props = {
  event?: FeedEvent;
  onLike?: (event: FeedEvent) => void;
  onComment?: (event: FeedEvent) => void;
  onClickShowComments?: (event: FeedEvent) => void;
};

export default function FeedItem({ event, onLike, onComment, onClickShowComments }: Props) {
  const { user, showAppMessage } = useAppContext();

  if (!event) {
    return null;
  }

  // const timestampStr = new Date(event?.timestamp).toLocaleString();
  // console.log('event', event);
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Box borderRadius={12} mb={10} width="50%">
          <ItemHeader event={event} />
          <Box ml={10}>
            {event.type === 'TWEET' && <TweetEvent event={event} />}
            {event.type === 'NFT_SALE' && <SaleEvent event={event} />}
            <Box display="flex" mt={4}>
              <Box
                color="gray.500"
                cursor="pointer"
                mr={12}
                display="flex"
                onClick={async () => {
                  if (user && user?.account) {
                    await addUserLike(event.id || '', user?.account, () => {
                      if (onLike) {
                        onLike(event);
                      }
                    });
                  }
                }}
              >
                <AiOutlineLike size={22} />
                &nbsp;{event.likes}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                color="gray.500"
                cursor="pointer"
                onClick={async () => {
                  if (user && user?.account) {
                    if (onClickShowComments) {
                      onClickShowComments(event);
                    }
                  } else {
                    showAppMessage('Please connect to Wallet.');
                  }
                }}
              >
                <ChatIcon mr={2} /> {event.comments}
              </Box>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
