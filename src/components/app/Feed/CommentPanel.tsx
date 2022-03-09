import { useState, useEffect } from 'react';
import { format } from 'timeago.js';
import {
  Box,
  Image,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Heading,
  IconButton,
  Textarea,
  Button
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { addUserComments, Comment, fetchComments, fetchMoreComments } from 'utils/firestore/firestoreUtils';
import { FeedEvent } from './FeedItem';
import { ellipsisString } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';
import { FetchMore } from 'components/FetchMore/FetchMore';

interface Props {
  isOpen: boolean;
  onClose: (newIsOpen: boolean) => void;
  event: FeedEvent;
}

export function CommentPanel({ isOpen, onClose, event, ...rest }: Props) {
  const { user } = useAppContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [text, setText] = useState('');
  const [data, setData] = useState<Comment[]>([
    {
      userAddress: 'user1',
      comment: 'comment 1',
      timestamp: 1646693311366
    },
    {
      userAddress: 'user2',
      comment: 'comment 2',
      timestamp: 1646693312500
    }
  ]);

  const fetchData = async () => {
    const commentsArr = await fetchComments(event.id);
    setData(commentsArr as Comment[]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      size="lg"
      onClose={() => undefined}
      blockScrollOnMount={false}
      trapFocus={false}
      {...rest}
    >
      <DrawerContent shadow="lg">
        <DrawerHeader display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg" color="gray.400" fontWeight="">
            Comments
          </Heading>
          <IconButton aria-label="" variant="ghost" size="lg" colorScheme="gray" onClick={() => onClose(false)}>
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <DrawerBody>
          <Box mb={6} display="flex">
            <Textarea mr={6} onChange={(ev) => setText(ev.target.value)} />
            <Button
              variant="outline"
              onClick={async () => {
                console.log('text', text);
                await addUserComments(event.id, user?.account ?? '', text);
                setData([]);
                setCurrentPage(0);
                fetchData();
              }}
            >
              Submit
            </Button>
          </Box>

          {data.map((item, idx: number) => {
            return (
              <Box key={idx} mb={8}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Image p={4} border="1px solid lightgray" alt="" borderRadius="50%" mr={2} />
                  <Box fontWeight="500" mr={6}>
                    {ellipsisString(item.userAddress)}
                  </Box>
                  <Box color="gray.500" title={new Date(item.timestamp).toLocaleString()}>
                    {format(item.timestamp)}
                  </Box>
                </Box>
                <pre>{item.comment}</pre>
              </Box>
            );
          })}

          <FetchMore
            currentPage={currentPage}
            onFetchMore={async () => {
              setCurrentPage(currentPage + 1);
              const arr = (await fetchMoreComments(event.id)) as Comment[];
              setData((currentComments) => [...currentComments, ...arr]);
            }}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
