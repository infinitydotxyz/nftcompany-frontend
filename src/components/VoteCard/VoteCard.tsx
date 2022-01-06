import { Box, Button, ChakraProps, propNames, Spacer, Text, Tooltip } from '@chakra-ui/react';
import { useEffect } from 'react';
import { numStr, renderSpinner } from 'utils/commonUtil';
import styles from './VoteCard.module.scss';

interface VoteCardProps {
  /**
   * prompt the user to vote
   * (e.g. How do you like this collection?)
   */
  prompt: string;

  /**
   * extra text displayed under the prompt
   */
  subtitle?: string;

  /**
   * text displayed on button to vote
   * for the prompt
   */
  positiveButtonLabel: string;

  /**
   * text displayed on button to vote
   * against the prompt
   */
  negativeButtonLabel: string;

  onVote: (votedForPrompt: boolean) => void;

  allowChangeVote: boolean;

  isLoading?: boolean;

  results?: { userVotedFor: boolean; votesFor: number; votesAgainst: number };

  disabled?: boolean | string;

  /**
   * reset the results
   */
  onChangeVote: () => void;
}

function VoteCard({
  prompt,
  subtitle,
  positiveButtonLabel,
  negativeButtonLabel,
  allowChangeVote,
  results,
  isLoading,
  disabled,
  onVote,
  onChangeVote,
  ...rest
}: VoteCardProps & ChakraProps) {
  const hasVoted = results;

  const VoteButtons = () => (
    <Tooltip label={disabled} isDisabled={!disabled}>
      <Box display="flex" flexDirection={'row'} width="100%">
        <Button
          flexBasis={0}
          flexGrow={1}
          height="72px"
          marginRight="5px"
          disabled={!!disabled}
          onClick={() => onVote(true)}
        >
          {positiveButtonLabel}
        </Button>
        <Button
          flexBasis={0}
          flexGrow={1}
          height="72px"
          marginLeft="5px"
          disabled={!!disabled}
          onClick={() => onVote(false)}
        >
          {negativeButtonLabel}
        </Button>
      </Box>
    </Tooltip>
  );

  const Loading = () => (
    <Box display="flex" flexDirection={'column'} width="100%" justifyContent={'center'} alignItems={'center'}>
      {renderSpinner()}
      <Text className={styles.subtitle} paddingTop="4px">
        Submitting vote
      </Text>
    </Box>
  );

  const Votes = (props: { results: { userVotedFor: boolean; votesFor: number; votesAgainst: number } }) => {
    const totalVotes = props.results.votesAgainst + props.results.votesFor;

    const percentFor = (props.results.votesFor / totalVotes) * 100;
    const percentAgainst = (props.results.votesAgainst / totalVotes) * 100;

    return (
      <Box display="flex" flexDirection={'column'} width="100%" minWidth={'400px'}>
        <Box position="relative" width="100%">
          <Box
            position="absolute"
            backgroundColor={'brandRedBright'}
            width="100%"
            height="72px"
            top={'-72px'}
            borderRadius={'8px'}
          />
          <Box
            position="absolute"
            backgroundColor={'brandGreen'}
            width={`${percentFor}%`}
            height="72px"
            top={'-72px'}
            borderLeftRadius={'8px'}
            borderRightRadius={percentFor > 98 ? '8px' : '0px'}
          />
        </Box>

        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width="100%">
          <Text>
            {numStr(percentFor)}% - {positiveButtonLabel}
          </Text>
          <Text>
            {numStr(percentAgainst)}% - {negativeButtonLabel}
          </Text>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      backgroundColor={'cardBgLight'}
      padding="24px"
      display="flex"
      flexDirection="column"
      justifyContent={'space-between'}
      alignItems={'flex-start'}
      borderRadius="8px"
      {...rest}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent={'flex-start'} width="100%">
        {hasVoted ? (
          <Box
            display="flex"
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'space-between'}
            width="100%"
          >
            <Text className={styles.title}>{`You voted ${
              results.userVotedFor ? positiveButtonLabel : negativeButtonLabel
            }`}</Text>
            {allowChangeVote && (
              <Button size="sm" variant={'alt'} onClick={onChangeVote}>
                I made a mistake
              </Button>
            )}
          </Box>
        ) : (
          <Text className={styles.title}>{prompt}</Text>
        )}
        {!hasVoted && (
          <Text className={styles.subtitle} paddingTop="4px">
            {subtitle}
          </Text>
        )}
      </Box>

      {isLoading ? <Loading /> : hasVoted ? <Votes results={results} /> : <VoteButtons />}
    </Box>
  );
}

export default VoteCard;
