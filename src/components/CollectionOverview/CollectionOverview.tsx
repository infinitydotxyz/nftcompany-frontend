import { Box, Image, Button, Text } from '@chakra-ui/react';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
interface CollectionOverviewProps {
  /**
   * name of the collection
   */
  collectionName: string;

  collectionAddress: string;

  /**
   * whether the collection is verified
   */
  hasBlueCheck: boolean;

  /**
   * the profile image for the collection
   */
  profileImage: string;

  /**
   * whether the collection has been claimed
   */
  hasBeenClaimed: boolean;

  /**
   * name of the creator of the collection
   */
  creator?: string;

  description?: string;

  isClaimed: boolean;

  onClickEdit: () => void;
}

function CollectionOverview(props: CollectionOverviewProps) {
  return (
    <Box display="flex" flexDirection="column" minWidth={'300px'}>
      <Box display="flex" flexDirection="row" marginBottom="32px">
        <Image src={props.profileImage} alt="" maxHeight="78px" marginRight="40px" />
        <Box display="flex" flexDirection="column" justifyContent={'space-between'}>
          <Box display="flex" flexDirection={'row'} alignItems={'center'}>
            <Text size="2xl" variant="close">
              {props.collectionName}
            </Text>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="28px"
              m={1}
              paddingTop={2}
              paddingLeft={2}
              verticalAlign={'middle'}
            >
              <BlueCheckIcon hasBlueCheck={props.hasBlueCheck === true} large />
            </Box>
          </Box>
          {props.creator && (
            <Text size="lg" variant="light">
              Created By: {props.creator}
            </Text>
          )}
        </Box>
      </Box>
      <Text size={'lg'} variant="dark" marginBottom={'40px'}>
        {props.description}
      </Text>
      <Button
        variant={'alt'}
        paddingY="16px"
        paddingX="32px"
        width="max-content"
        fontSize="12px"
        onClick={props.onClickEdit}
      >
        {props.hasBeenClaimed ? 'Edit Collection' : 'Claim Collection'}
      </Button>
    </Box>
  );
}

export default CollectionOverview;
