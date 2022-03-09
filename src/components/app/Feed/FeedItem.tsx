import { format } from 'timeago.js';
import { Box } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { addUserLike } from 'utils/firestore/firestoreUtils';
import { useAppContext } from 'utils/context/AppContext';
import { ChatIcon } from '@chakra-ui/icons';
import { AiOutlineLike } from 'react-icons/ai';
import { ellipsisString } from 'utils/commonUtil';

import NftImage from './NftImage';

export type FeedEventType = 'COLL' | 'NFT' | 'SALE' | 'TWEET';

export type FeedEvent = {
  id: string;
  type: FeedEventType;
  tokenAddress?: string;
  tokenId?: string;
  userAddress?: string;
  price?: number;
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
  onClickShowComments?: (event: FeedEvent) => void;
};

export default function FeedItem({ event, onLike, onComment, onClickShowComments }: Props) {
  const { user } = useAppContext();

  if (!event) {
    return null;
  }

  const timestampStr = new Date(event?.timestamp).toLocaleString();
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Box borderRadius={12} mb={10} width="50%">
          <Box display="flex" alignItems="center" mb={2}>
            <Image p={4} border="1px solid lightgray" alt="" borderRadius="50%" mr={2} />
            <Box>
              <Box display="flex">
                <Box fontWeight="500" mr={6}>
                  {ellipsisString(event.tokenAddress)}
                </Box>
                <Box color="gray.500" title={new Date(event.timestamp).toLocaleString()}>
                  {format(event.timestamp)}
                </Box>
              </Box>
              <Box display="flex" color="gray.500">
                {event.type === 'SALE' ? 'Sale' : event.type}
              </Box>
            </Box>
          </Box>
          <Box ml={10}>
            {event.title}
            {event.type === 'TWEET' && (
              <Box mt={4}>
                <img src={event.imageUrl} alt="" />
              </Box>
            )}
            {event.type === 'SALE' && (
              <Box
                display="flex"
                alignItems="center"
                backgroundColor="rgb(245, 245, 245, 1)"
                borderRadius={14}
                p={4}
                mt={4}
              >
                <NftImage
                  tokenAddress={event.tokenAddress ?? ''}
                  tokenId={event.tokenId ?? ''}
                  border="1px solid lightgray"
                  width={20}
                  height={20}
                  borderRadius={14}
                  mr={8}
                  alt=""
                  src="https://lh3.googleusercontent.com/Gpqw-XOK-1OavLKNN6pMG5s6v98dbICTBQ6gQRgTW-GhxvJDlYpXN31NiTYMYIvl7dwMqJxYa16yEwRbDtFYHiTEKbsRdkdl1c3rcw=w600"
                />

                <Box display="flex" width="100%">
                  <Box width="50%">
                    <Box>Buyer</Box>
                    <Box fontWeight={500} title={event.userAddress}>
                      {ellipsisString(event.userAddress)}
                    </Box>
                  </Box>
                  <Box width="50%">
                    <Box>Price</Box>
                    <Box fontWeight={500}>{event.price} ETH</Box>
                  </Box>
                </Box>
              </Box>
            )}
            <Box display="flex" mt={4}>
              <Box
                color="gray.500"
                cursor="pointer"
                mr={4}
                display="flex"
                onClick={async () => {
                  if (user && user?.account) {
                    await addUserLike(event.id, user?.account, () => {
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
