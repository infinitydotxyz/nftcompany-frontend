import { ExternalLinkIcon, CloseIcon, CopyIcon } from '@chakra-ui/icons';

import {
  ListIcon,
  AddCartIcon,
  MoneyIcon,
  OfferIcon,
  ImageSearchIcon,
  ImageIcon,
  StarIcon,
  AccountIcon,
  CartIcon,
  CollectionsIcon,
  ShoppingBagIcon,
  SignInIcon,
  ExploreIcon,
  SortIcon
} from 'components/Icons/Icons';

const bs = '20px';
const sbs = '14px';

export class MenuIcons {
  static wrap(el: any) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 18, width: 18 }}>{el}</div>
    );
  }

  static settings = MenuIcons.wrap(<AccountIcon boxSize={bs} />);
  static externalLinkIcon = MenuIcons.wrap(<ExternalLinkIcon boxSize={bs} />);
  static imageIcon = MenuIcons.wrap(<ImageIcon boxSize={bs} />);
  static cartIcon = MenuIcons.wrap(<CartIcon boxSize={bs} />);
  static offerIcon = MenuIcons.wrap(<OfferIcon boxSize={bs} />);
  static listIcon = MenuIcons.wrap(<ListIcon boxSize={bs} />);
  static moneyIcon = MenuIcons.wrap(<MoneyIcon boxSize={bs} />);
  static addCartIcon = MenuIcons.wrap(<AddCartIcon boxSize={bs} />);
  static shoppingBagIcon = MenuIcons.wrap(<ShoppingBagIcon boxSize={bs} />);

  static imageSearchIcon = MenuIcons.wrap(<ImageSearchIcon boxSize={bs} />);
  static starIcon = MenuIcons.wrap(<StarIcon boxSize={bs} />);
  static signInIcon = MenuIcons.wrap(<SignInIcon boxSize={bs} />);
  static copyIcon = MenuIcons.wrap(<CopyIcon boxSize={bs} />);
  static sortIcon = MenuIcons.wrap(<SortIcon boxSize={bs} />);
  static collectionsIcon = MenuIcons.wrap(<CollectionsIcon boxSize={bs} />);
  static exploreIcon = MenuIcons.wrap(<ExploreIcon boxSize={bs} />);

  // these are too large at bs, so use sbs
  static closeIcon = MenuIcons.wrap(<CloseIcon boxSize={sbs} />);
}
