import { Box, Button, ChakraProps, Spacer, Text } from '@chakra-ui/react';
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

  results?: { userVotedFor: boolean; totalFor: number; totalAgainst: number };
}

function VoteCard({
  prompt,
  subtitle,
  positiveButtonLabel,
  negativeButtonLabel,
  onVote,
  allowChangeVote,
  results,
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

      <Box display="flex" flexDirection={'row'} width="100%">
        <Button flexBasis={0} flexGrow={1} height="72px" marginRight="5px" onClick={() => onVote(true)}>
          {positiveButtonLabel}
        </Button>
        <Button flexBasis={0} flexGrow={1} height="72px" marginLeft="5px" onClick={() => onVote(false)}>
          {negativeButtonLabel}
        </Button>
      </Box>
    </Box>
  );
}

export default VoteCard;
