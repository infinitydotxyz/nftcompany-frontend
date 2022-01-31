import { ExternalLinkIcon, CloseIcon, CopyIcon } from '@chakra-ui/icons';
import { BsGraphUp } from 'react-icons/bs';

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
  SortIcon,
  TrendingIcon
} from 'components/Icons/Icons';

export class MenuIcons {
  static size = 20;

  static bs = `${MenuIcons.size}px`;
  static sbs = '14px';

  static wrap(el: any) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: MenuIcons.size,
          width: MenuIcons.size
        }}
      >
        {el}
      </div>
    );
  }

  static settings = MenuIcons.wrap(<AccountIcon boxSize={MenuIcons.bs} />);
  static externalLinkIcon = MenuIcons.wrap(<ExternalLinkIcon boxSize={MenuIcons.bs} />);
  static imageIcon = MenuIcons.wrap(<ImageIcon boxSize={MenuIcons.bs} />);
  static cartIcon = MenuIcons.wrap(<CartIcon boxSize={MenuIcons.bs} />);
  static offerIcon = MenuIcons.wrap(<OfferIcon boxSize={MenuIcons.bs} />);
  static listIcon = MenuIcons.wrap(<ListIcon boxSize={MenuIcons.bs} />);
  static moneyIcon = MenuIcons.wrap(<MoneyIcon boxSize={MenuIcons.bs} />);
  static addCartIcon = MenuIcons.wrap(<AddCartIcon boxSize={MenuIcons.bs} />);
  static shoppingBagIcon = MenuIcons.wrap(<ShoppingBagIcon boxSize={MenuIcons.bs} />);

  static imageSearchIcon = MenuIcons.wrap(<ImageSearchIcon boxSize={MenuIcons.bs} />);
  static starIcon = MenuIcons.wrap(<StarIcon boxSize={MenuIcons.bs} />);
  static signInIcon = MenuIcons.wrap(<SignInIcon boxSize={MenuIcons.bs} />);
  static copyIcon = MenuIcons.wrap(<CopyIcon boxSize={MenuIcons.bs} />);
  static sortIcon = MenuIcons.wrap(<SortIcon boxSize={MenuIcons.bs} />);
  static collectionsIcon = MenuIcons.wrap(<CollectionsIcon boxSize={MenuIcons.bs} />);
  static exploreIcon = MenuIcons.wrap(<ExploreIcon boxSize={MenuIcons.bs} />);
  static trendingIcon = MenuIcons.wrap(<TrendingIcon boxSize={MenuIcons.bs} />);

  // these are too large at bs, so use sbs
  static closeIcon = MenuIcons.wrap(<CloseIcon boxSize={MenuIcons.sbs} />);
}

export class LargeIcons {
  static size = 24;

  static bs = `${LargeIcons.size}px`;
  static sbs = '16px';

  static wrap(el: any) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: LargeIcons.size,
          width: LargeIcons.size
        }}
      >
        {el}
      </div>
    );
  }

  static settings = LargeIcons.wrap(<AccountIcon boxSize={LargeIcons.bs} />);
  static externalLinkIcon = LargeIcons.wrap(<ExternalLinkIcon boxSize={LargeIcons.bs} />);
  static imageIcon = LargeIcons.wrap(<ImageIcon boxSize={LargeIcons.bs} />);
  static cartIcon = LargeIcons.wrap(<CartIcon boxSize={LargeIcons.bs} />);
  static offerIcon = LargeIcons.wrap(<OfferIcon boxSize={LargeIcons.bs} />);
  static listIcon = LargeIcons.wrap(<ListIcon boxSize={LargeIcons.bs} />);
  static moneyIcon = LargeIcons.wrap(<MoneyIcon boxSize={LargeIcons.bs} />);
  static addCartIcon = LargeIcons.wrap(<AddCartIcon boxSize={LargeIcons.bs} />);
  static shoppingBagIcon = LargeIcons.wrap(<ShoppingBagIcon boxSize={LargeIcons.bs} />);

  static imageSearchIcon = LargeIcons.wrap(<ImageSearchIcon boxSize={LargeIcons.bs} />);
  static starIcon = LargeIcons.wrap(<StarIcon boxSize={LargeIcons.bs} />);
  static signInIcon = LargeIcons.wrap(<SignInIcon boxSize={LargeIcons.bs} />);
  static copyIcon = LargeIcons.wrap(<CopyIcon boxSize={LargeIcons.bs} />);
  static sortIcon = LargeIcons.wrap(<SortIcon boxSize={LargeIcons.bs} />);
  static collectionsIcon = LargeIcons.wrap(<CollectionsIcon boxSize={LargeIcons.bs} />);
  static exploreIcon = LargeIcons.wrap(<ExploreIcon boxSize={LargeIcons.bs} />);
  static trendingIcon = LargeIcons.wrap(<TrendingIcon boxSize={LargeIcons.bs} />);

  // these are too large at bs, so use sbs
  static closeIcon = LargeIcons.wrap(<CloseIcon boxSize={LargeIcons.sbs} />);
}
