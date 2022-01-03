import { Box, Image, Text, Button } from '@chakra-ui/react';

import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import styles from './CollectionOverview.module.scss';
interface CollectionOverviewProps {
  /**
   * name of the collection
   */
  collectionName: string;

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
}

function CollectionOverview(props: CollectionOverviewProps) {
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" marginBottom="32px">
        <Image src={props.profileImage} alt="" maxHeight="78px" marginRight="40px" />
        <Box display="flex" flexDirection="column" justifyContent={'space-between'}>
          <Box display="flex" flexDirection={'row'} alignItems={'center'}>
            <p className={styles.title}>{props.collectionName}</p>
            <div style={{ paddingLeft: '16px', verticalAlign: 'middle' }}>
              <BlueCheckIcon hasBlueCheck={props.hasBlueCheck === true} large />
            </div>
          </Box>
          {props.creator && <p className={styles.subtitle}>Created by: {props.creator}</p>}
        </Box>
      </Box>
      <p className={styles.description}>{props.description}</p>
      <Button
        variant={'alt'}
        paddingY="16px"
        paddingX="32px"
        width="max-content"
        fontSize="12px"
        onClick={(e) => {
          throw new Error('Not yet implemented');
        }}
      >
        {props.hasBeenClaimed ? 'Claim collection' : 'Edit collection'}
      </Button>
    </Box>
  );
}

export default CollectionOverview;
