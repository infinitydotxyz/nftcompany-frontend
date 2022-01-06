import { Box, Button, ChakraProps, propNames, Spacer, Text, Tooltip } from '@chakra-ui/react';
import { renderSpinner } from 'utils/commonUtil';
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

  results?: { userVotedFor: boolean; totalFor: number; totalAgainst: number };

  disabled?: boolean | string;
}

function VoteCard({
  prompt,
  subtitle,
  positiveButtonLabel,
  negativeButtonLabel,
  onVote,
  allowChangeVote,
  results,
  isLoading,
  disabled,
  ...rest
}: VoteCardProps & ChakraProps) {
  const hasVoted = results;

  return (
    <Box
      backgroundColor={'cardBgLight'}
      paddingX="52px"
      paddingY="30px"
      display="flex"
      flexDirection="column"
      justifyContent={'space-between'}
      alignItems={'flex-start'}
      borderRadius="8px"
      {...rest}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent={'flex-start'}>
        {hasVoted ? (
          <Box display="flex" flexDirection={'row'}>
            <Text className={styles.title}>{`You voted ${
              results.userVotedFor ? positiveButtonLabel : negativeButtonLabel
            }`}</Text>
            {allowChangeVote && <Button>I made a mistake</Button>}
          </Box>
        ) : (
          <Text className={styles.title}>{prompt}</Text>
        )}
        {!results && (
          <Text className={styles.subtitle} paddingTop="4px">
            {subtitle}
          </Text>
        )}
      </Box>

      {isLoading ? (
        <Box display="flex" flexDirection={'column'} width="100%" justifyContent={'center'} alignItems={'center'}>
          {renderSpinner()}
          <Text className={styles.subtitle} paddingTop="4px">
            Submitting vote
          </Text>
        </Box>
      ) : (
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
      )}
    </Box>
  );
}

export default VoteCard;
