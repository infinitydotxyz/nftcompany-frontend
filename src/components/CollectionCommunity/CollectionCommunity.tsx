import { Box, Spacer } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/react';
import ExternalLinkCard from 'components/ExternalLinkCard/ExternalLinkCard';
import { TwitterFeed } from 'components/TwitterFeed/TwitterFeed';
import VoteCard from 'components/VoteCard/VoteCard';
import WithTitle from 'components/WithTitle/WithTitle';
import { useEffect, useRef, useState } from 'react';
import { CollectionData } from 'services/Collections.service';
import { apiGet, apiPost } from 'utils/apiUtil';
import { numStr } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';

interface CollectionCommunityProps {
  collectionInfo?: CollectionData;
  onClickEdit: () => void;
}

function CollectionCommunity({ collectionInfo, onClickEdit, ...rest }: CollectionCommunityProps & ChakraProps) {
  const { user, showAppError } = useAppContext();
  const twitterFeedContainerRef = useRef<any>();
  const [twitterFeedWidth, setTwitterFeedWidth] = useState(430);

  useEffect(() => {
    const resizeTwitterFeed = () => {
      let width = twitterFeedContainerRef.current?.getBoundingClientRect?.()?.width ?? 430;
      width = width > 430 ? 430 : width;
      setTwitterFeedWidth(width);
    };
    window.addEventListener('resize', resizeTwitterFeed);

    return () => {
      window.removeEventListener('resize', resizeTwitterFeed);
    };
  }, []);

  const [votes, setVotes] = useState<{ userVotedFor: boolean; votesFor: number; votesAgainst: number } | undefined>();
  const [isVotesLoading, setIsVotesLoading] = useState(false);

  const onVote = async (votedFor: boolean) => {
    setIsVotesLoading(true);
    try {
      if (collectionInfo?.address && user?.account) {
        const response = await apiPost(`/u/${user.account}/vote`, undefined, {
          votedFor,
          collectionAddress: collectionInfo.address
        });
        if (response.status === 200) {
          await getUserVote();
        } else if (response.status !== 429) {
          showAppError('Failed to save vote. Please try again in a few seconds');
        }
      }
    } catch (err) {
      console.error(err);
      showAppError('Failed to save vote. Please try again in a few seconds');
    } finally {
      setIsVotesLoading(false);
    }
  };

  const getUserVote = async () => {
    if (collectionInfo?.address && user?.account) {
      const response = await apiGet(
        `/u/${user.account}/vote`,
        {
          collectionAddress: collectionInfo.address
        },
        undefined,
        false
      );

      const userVote: boolean | undefined = response.result?.userVote?.votedFor;
      const totals = response?.result?.votes;
      if (userVote !== undefined && totals) {
        setVotes({ userVotedFor: userVote, votesFor: totals.votesFor, votesAgainst: totals.votesAgainst });
      }
    }
  };

  useEffect(() => {
    getUserVote();
  }, [user?.account, collectionInfo?.address]);

  return (
    <Box
      display="flex"
      flexDirection={['column', 'column', 'column', 'row']}
      justifyContent={'space-between'}
      alignItems={'space-between'}
      {...rest}
    >
      <Box display={'flex'} flexDirection={['column']} width={['50%', '50%', '50%', '100%']} marginTop="56px">
        <Box display={'flex'} flexDirection={'row'} width={'100%'} alignItems={'flex-start'}>
          <WithTitle title="Twitter mentions">
            <Box maxHeight={'300'} overflowY="scroll">
              {collectionInfo?.twitterSnippet?.topMentions && collectionInfo?.twitterSnippet?.topMentions.length > 0 ? (
                collectionInfo?.twitterSnippet?.topMentions?.map((mention) => {
                  return (
                    <ExternalLinkCard
                      key={mention.id}
                      marginY="8px"
                      title={mention.name}
                      subtitle={`Followers: ${numStr(mention.followersCount)}`}
                      link={`https://twitter.com/${mention.username}`}
                      linkText="View Profile"
                    />
                  );
                })
              ) : (
                <ExternalLinkCard
                  key={'default-twitter-mention'}
                  marginY="8px"
                  title={'Name'}
                  subtitle={``}
                  linkText="Add Twitter"
                  onClick={onClickEdit}
                />
              )}
            </Box>
          </WithTitle>

          <Spacer width={['32px', '32px', '32px', '56px']} maxWidth={['32px', '32px', '32px', '56px']} />

          <WithTitle title="Partnerships">
            <Box maxHeight={'300'} overflowY="auto">
              {collectionInfo?.partnerships && collectionInfo?.partnerships?.length > 0 ? (
                collectionInfo?.partnerships?.map((partnership) => {
                  return (
                    <ExternalLinkCard
                      key={partnership.name}
                      marginY="8px"
                      title={partnership.name}
                      subtitle={'Team'}
                      link={partnership.link}
                      linkText="Website"
                    />
                  );
                })
              ) : (
                <ExternalLinkCard
                  key={'default-partnership'}
                  marginY="8px"
                  title={'Name'}
                  subtitle={''}
                  linkText="Add Partnership"
                  onClick={onClickEdit}
                />
              )}
            </Box>
          </WithTitle>
        </Box>

        <Spacer maxHeight={{ md: '32px', lg: '32px', xl: '56px' }} />

        <Box display={'flex'} flexDirection={'row'} marginTop="56px" justifyContent={'space-between'}>
          <WithTitle title="Vote">
            <VoteCard
              prompt="How do you like this collection?"
              subtitle="Vote to see the community results"
              positiveButtonLabel="Good"
              negativeButtonLabel="Bad"
              onVote={onVote}
              allowChangeVote={true}
              height="223px"
              disabled={!user?.account && 'You must be logged in to vote.'}
              results={votes}
              isLoading={isVotesLoading}
            />
          </WithTitle>
        </Box>
      </Box>

      <Box
        display={'flex'}
        flexDirection={['column']}
        width={['100%', '100%', '100%', '50%']}
        marginTop={[0, 0, 0, '56px']}
        alignItems={['flex-start', 'flex-start', 'flex-start', 'flex-end']}
      >
        {collectionInfo?.twitterSnippet?.recentTweets && collectionInfo?.twitterSnippet?.recentTweets?.length > 0 && (
          <Box flexBasis={0} flexGrow={1} ref={twitterFeedContainerRef} marginTop={['56px', '56px', '56px', 0]}>
            <WithTitle title={'Twitter feed'}>
              <TwitterFeed
                width={twitterFeedWidth}
                tweetIds={collectionInfo?.twitterSnippet?.recentTweets?.map((item) => item.tweetId)}
                height="600px"
                overflowY="scroll"
              />
            </WithTitle>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CollectionCommunity;
