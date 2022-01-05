import { Box } from '@chakra-ui/layout';
import { ChakraProps, useColorMode } from '@chakra-ui/react';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { useEffect, useState } from 'react';
import { renderSpinner } from 'utils/commonUtil';
import Tweet from './Tweet';

export const loadTwitterWidget = () => {
  (window as any).twttr = (function (d, s, id) {
    const fjs = d.getElementsByTagName(s)[0];
    const t = (window as any).twttr || {};
    if (d.getElementById(id)) {
      return t;
    }
    const js = d.createElement(s);
    js.id = id;
    (js as any).src = 'https://platform.twitter.com/widgets.js';
    (fjs as any).parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function (f: any) {
      t._e.push(f);
    };
    return t;
  })(document, 'script', 'twitter-wjs');
};

interface TwitterFeedProps {
  tweetIds: string[];
  width: number;
}

export function TwitterFeed({ tweetIds, width, ...rest }: TwitterFeedProps & ChakraProps) {
  const [hiddenTweets, setHiddenTweets] = useState<string[]>(tweetIds);
  const [displayedTweets, setDisplayedTweets] = useState<string[]>([]);
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadTwitterWidget();
  }, []);

  const loadMore = async () => {
    /**
     * used to load tweets 1 at a time
     * if you request all at once then it takes a while
     * to receive the response and none are rendered until all
     * have loaded
     */
    setIsLoading((currentlyLoading) => {
      /**
       * hack to stop the scroll loader from loading too soon
       */
      if (!currentlyLoading) {
        setHiddenTweets((prevHidden) => {
          const tweetsToDisplay = prevHidden.splice(0, 1);
          setDisplayedTweets((prev) => {
            return [...prev, ...tweetsToDisplay];
          });
          setHasMore(prevHidden.length > 0);

          return prevHidden;
        });
        return true;
      }
      return currentlyLoading;
    });
  };

  return (
    <Box {...rest}>
      {displayedTweets.map((item) => {
        return (
          <Tweet
            key={item}
            tweetId={item}
            isDarkMode={colorMode === 'dark'}
            width={width}
            onLoaded={() => setIsLoading(false)}
            onFailed={() => setIsLoading(false)}
          />
        );
      })}

      {isLoading && (
        <Box display="flex" flexDirection={'column'} justifyContent={'center'} alignItems={'center'} height={'50px'}>
          {renderSpinner()}
        </Box>
      )}

      {!isLoading && hasMore && (
        <ScrollLoader
          onFetchMore={() => {
            loadMore();
          }}
        />
      )}
    </Box>
  );
}
