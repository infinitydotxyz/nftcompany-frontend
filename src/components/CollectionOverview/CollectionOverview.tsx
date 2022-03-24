import { Box, Image, Button, Text } from '@chakra-ui/react';
import Chip from 'components/base/Chip/Chip';
import GraphPreviewForChip from 'components/GraphPreview/GraphPreviewForChip';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { FaDiscord, FaTwitter, FaInstagram, FaFacebook, FaCheck } from 'react-icons/fa';
import { DiscordSocialData, TwitterSocialData } from '../../../pages/collection2/[name]';

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

  twitterData: TwitterSocialData[];
  discordData: DiscordSocialData[];
}

function CollectionOverview(props: CollectionOverviewProps) {
  return (
    <Box display="flex" flexDirection="column" minWidth={'300px'}>
      <Box display="flex" flexDirection="row" marginBottom="16px">
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

      <div className="flex mb-6">
        <Chip content="Watch" />
        <Chip content="Edit" />
        <Chip
          left={<FaTwitter />}
          content={
            <GraphPreviewForChip
              data={props.twitterData.map((item) => {
                return { ...item, y: item.followersCount };
              })}
            />
          }
        />
        <Chip
          left={<FaDiscord />}
          content={
            <GraphPreviewForChip
              data={props.discordData.map((item) => {
                return { ...item, y: item.membersCount };
              })}
            />
          }
        />
        <Chip content={<FaInstagram />} />
        <Chip content={<FaFacebook />} />
      </div>

      <div className="text-gray-500 mb-4 text-sm">{props.description}</div>

      <div className="text-sm font-bold">
        <div>Ownership includes</div>
        <div className="flex space-x-8 mt-2">
          <div className="flex text-gray-500">
            <FaCheck className="mr-2" />
            Access
          </div>
          <div className="flex text-gray-500">
            <FaCheck className="mr-2" />
            Royalties
          </div>
          <div className="flex text-gray-500">
            <FaCheck className="mr-2" />
            IP rights
          </div>
        </div>
      </div>

      <button className="btn w-60 mt-8" onClick={props.onClickEdit}>
        Claim Collection
      </button>

      <table className="mt-8 text-sm">
        <tr className="text-gray-400">
          <th className="text-left">Items</th>
          <th className="text-left">Owned by</th>
          <th className="text-left">Floor price</th>
          <th className="text-left">Volume traded</th>
        </tr>
        <tr className="font-bold">
          <td>379</td>
          <td>999</td>
          <td>0.40 ETH</td>
          <td>899</td>
        </tr>
      </table>
    </Box>
  );
}

export default CollectionOverview;
