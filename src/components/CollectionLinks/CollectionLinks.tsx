import InfoGroup from 'components/InfoGroup/InfoGroup';
import { CollectionLinks as CollectionLinksType } from 'services/Collections.service';
import { MdOutlineAddCircle } from 'react-icons/md';
import {
  FaFacebook,
  FaTwitter,
  FaDiscord,
  FaInstagram,
  FaMedium,
  FaTelegram,
  FaWikipediaW,
  FaLink
} from 'react-icons/fa';
import { Box } from '@chakra-ui/react';
import { Optional } from 'utils/typeUtils';

interface CollectionLinksProps {
  links: Optional<CollectionLinksType, 'timestamp'>;
  isClaimed: boolean;
  onClickEdit: () => void;
}

enum SocialMedia {
  Twitter,
  Discord,
  Medium,
  Instagram,
  Facebook,
  Telegram,
  Wiki,
  External
}

interface SocialMediaLinkProps {
  link: string;
  type: SocialMedia;
}

interface SocialMediaButtonProps {
  onClick: () => void;
  type: SocialMedia;
  plus?: boolean;
}

type Props = SocialMediaLinkProps | SocialMediaButtonProps;

function SocialMediaIcon(props: Props) {
  const iconProps = { size: '32px' };
  let icon;
  switch (props.type) {
    case SocialMedia.Twitter:
      icon = <FaTwitter {...iconProps} />;
      break;
    case SocialMedia.Discord:
      icon = <FaDiscord {...iconProps} />;
      break;
    case SocialMedia.Instagram:
      icon = <FaInstagram {...iconProps} />;
      break;
    case SocialMedia.Medium:
      icon = <FaMedium {...iconProps} />;
      break;
    case SocialMedia.Facebook:
      icon = <FaFacebook {...iconProps} />;
      break;
    case SocialMedia.Telegram:
      icon = <FaTelegram {...iconProps} />;
      break;
    case SocialMedia.Wiki:
      icon = <FaWikipediaW {...iconProps} />;
      break;
    case SocialMedia.External:
      icon = <FaLink {...iconProps} />;
      break;
    default:
      throw new Error('Invalid icon requested');
  }

  if ('onClick' in props) {
    if (props.plus) {
      return (
        <Box position="relative" onClick={props.onClick} cursor={'pointer'}>
          {icon}
          <Box position="absolute" left="19px" top="15px">
            <MdOutlineAddCircle
              size={'20px'}
              stroke={'black'}
              style={{ backgroundColor: 'white', borderRadius: '9999px' }}
            />
          </Box>
        </Box>
      );
    }

    return (
      <Box onClick={props.onClick} cursor={'pointer'}>
        {icon}
      </Box>
    );
  }

  return (
    <a href={props.link} target="_blank" rel="noreferrer">
      {icon}
    </a>
  );
}

function CollectionLinks(props: CollectionLinksProps) {
  const external = props.links.external && (
    <SocialMediaIcon key="external" link={props.links.external} type={SocialMedia.External} />
  );
  const twitter = props.links.twitter && (
    <SocialMediaIcon key="twitter" link={props.links.twitter} type={SocialMedia.Twitter} />
  );
  const discord = props.links.discord && (
    <SocialMediaIcon key="discord" link={props.links.discord} type={SocialMedia.Discord} />
  );
  const instagram = props.links.instagram && (
    <SocialMediaIcon key="instagram" link={props.links.instagram} type={SocialMedia.Instagram} />
  );
  const medium = props.links.medium && (
    <SocialMediaIcon key="medium" link={props.links.medium} type={SocialMedia.Medium} />
  );
  const facebook = props.links.facebook && <SocialMediaIcon link={props.links.facebook} type={SocialMedia.Facebook} />;

  const telegram = props.links.telegram && (
    <SocialMediaIcon key="telegram" link={props.links.telegram} type={SocialMedia.Telegram} />
  );
  const wiki = props.links.wiki && <SocialMediaIcon key="wiki" link={props.links.wiki} type={SocialMedia.Wiki} />;

  let links = [twitter, discord, instagram, medium, telegram, wiki, facebook, external].filter((item) => item);

  if (links.length === 0) {
    const externalIconButton = (
      <SocialMediaIcon key="add-external" onClick={props.onClickEdit} type={SocialMedia.External} plus />
    );
    const twitterIconButton = (
      <SocialMediaIcon key="add-twitter" onClick={props.onClickEdit} type={SocialMedia.Twitter} plus />
    );
    const discordIconButton = (
      <SocialMediaIcon key="add-discord" onClick={props.onClickEdit} type={SocialMedia.Discord} plus />
    );
    const mediumIconButton = (
      <SocialMediaIcon key="add-medium" onClick={props.onClickEdit} type={SocialMedia.Medium} plus />
    );

    links = [externalIconButton, twitterIconButton, discordIconButton, mediumIconButton];
  }

  return <>{links}</>;
}

export default CollectionLinks;
