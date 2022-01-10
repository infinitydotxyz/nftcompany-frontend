import { Box } from '@chakra-ui/layout';
import { useEffect, useRef } from 'react';

interface TwitterEmbedProps {
  tweetId: string;
  width: number;
  isDarkMode?: boolean;
  onLoaded?: () => void;
  onFailed?: () => void;
}

function Tweet(props: TwitterEmbedProps) {
  const tweetRef = useRef<any>();

  useEffect(() => {
    if (!(window as any)?.twttr?.widgets?.createTweet) {
      props.onFailed?.();
    } else {
      (window as any).twttr.widgets
        .createTweet(props.tweetId, tweetRef.current, {
          theme: props.isDarkMode ? 'dark' : 'light',
          width: props.width,
          conversation: 'none',
          dnt: true,
          cards: 'hidden'
        })
        .then(() => {
          props.onLoaded?.();
        })
        .catch(() => {
          props.onFailed?.();
        });
    }
  }, []);

  return <Box ref={tweetRef} width={props.width} />;
}

export default Tweet;
