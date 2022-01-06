import { Box, Spacer } from '@chakra-ui/layout';
import ExternalLinkCard from 'components/ExternalLinkCard/ExternalLinkCard';
import { TwitterFeed } from 'components/TwitterFeed/TwitterFeed';
import VoteCard from 'components/VoteCard/VoteCard';
import WithTitle from 'components/WithTitle/WithTitle';
import { useEffect, useState } from 'react';
import { CollectionData } from 'services/Collections.service';
import { apiGet } from 'utils/apiUtil';
import { numStr } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';

interface CollectionCommunityProps {
  collectionInfo?: CollectionData;
}

const testData = {
  benefits: ['Access', 'Royalties', 'IP rights'],
  partnerships: [
    { name: 'OpenSea', link: 'blah.com' },
    { name: 'Nike', link: 'blah.com' },
    { name: 'The Garrets', link: 'blah.com' },
    { name: 'Some Really long partner name that no one would ever use', link: 'blah.com' },
    { name: 'OpenSea2', link: 'blah.com' },
    { name: 'OpenSea3', link: 'blah.com' }
  ]
};

function CollectionCommunity({ collectionInfo }: CollectionCommunityProps) {
  const { user } = useAppContext();

  const [userVote, setUserVote] = useState<any>();
  const [collectionVotes, setCollectionVotes] = useState<any>();

  const getUserVote = async () => {
    if (collectionInfo?.address && user?.account) {
      const vote = await apiGet(
        `/u/${user.account}/vote`,
        {
          collectionAddress: collectionInfo.address
        },
        undefined,
        false
      );
      console.log(vote?.result, vote?.error, vote?.status);
    }
  };

  useEffect(() => {
    getUserVote();
  }, [user?.account, collectionInfo?.address]);

  return (
    <Box>
      <Box display={'flex'} flexDirection={'row'} marginTop="56px" justifyContent={'space-between'}>
        <Box display={'flex'} flexDirection={'row'}>
          <WithTitle title="Twitter mentions">
            <Box maxHeight={'300'} overflowY="auto">
              {collectionInfo?.twitterSnippet?.topMentions?.map((mention) => {
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
              })}
            </Box>
          </WithTitle>

          <Spacer width={'56px'} />

          <WithTitle title="Partnerships">
            <Box maxHeight={'300'} overflowY="auto">
              {testData.partnerships?.map((partnership) => {
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
              })}
            </Box>
          </WithTitle>
        </Box>

        {collectionInfo?.twitterSnippet?.recentTweets?.length && (
          <Box marginLeft={'56px'}>
            <WithTitle title={'Twitter feed'}>
              <TwitterFeed
                width={500}
                tweetIds={collectionInfo?.twitterSnippet?.recentTweets?.map((item) => item.tweetId)}
                height="300px"
                overflowY="auto"
              />
            </WithTitle>
          </Box>
        )}
      </Box>

      <Box display={'flex'} flexDirection={'row'} marginTop="56px" justifyContent={'space-between'}>
        <WithTitle title="Vote">
          <VoteCard
            prompt="How do you like this collection?"
            subtitle="Vote to see the community results"
            positiveButtonLabel="Good"
            negativeButtonLabel="Bad"
            onVote={(vote: boolean) => console.log(`user voted ${vote}`)}
            allowChangeVote={true}
            height="223px"
            disabled={!user?.account && 'You must be logged in to vote.'}
          />
        </WithTitle>
      </Box>
    </Box>
  );
}

export default CollectionCommunity;
