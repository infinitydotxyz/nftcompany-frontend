import InfoGroup from 'components/InfoGroup/InfoGroup';
import { CollectionLinks as CollectionLinksType } from 'services/Collections.service';
import {
  FaFacebook,
  FaTwitter,
  FaDiscord,
  FaInstagram,
  FaMedium,
  FaTelegram,
  FaWikipediaW,
  FaExternalLinkAlt
} from 'react-icons/fa';

interface CollectionLinksProps {
  links: CollectionLinksType;
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

function SocialMediaIcon(props: { link: string; type: SocialMedia }) {
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
      icon = <FaExternalLinkAlt {...iconProps} />;
      break;
    default:
      throw new Error('Invalid icon requested');
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
  // const facebook = props.links.facebook && <SocialMediaIcon link={props.links.discord} type={SocialMedia.Discord}/>
  const telegram = props.links.telegram && (
    <SocialMediaIcon key="telegram" link={props.links.telegram} type={SocialMedia.Telegram} />
  );
  const wiki = props.links.wiki && <SocialMediaIcon key="wiki" link={props.links.wiki} type={SocialMedia.Wiki} />;

  const links = [twitter, discord, instagram, medium, telegram, wiki, external].filter((item) => item);

  return <>{links}</>;
}

export default CollectionLinks;
