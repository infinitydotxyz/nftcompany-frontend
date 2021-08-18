// import axios from 'axios'

export const sampleData = [
  {
    id: '0',
    title: 'Amazing Art',
    description:
      'This NFT Card will give you Access to Special Airdrops. To learn more about UI8 please visit https://ui8.net',
    price: 0.1,
    inStock: 1,
    img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-1.jpg'
  },
  {
    id: '1',
    title: 'Ribbon Hunter',
    price: 0.2,
    inStock: 2,
    img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-2.jpg'
  },
  {
    id: '2',
    title: 'Gems',
    price: 0.3,
    inStock: 3,
    img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-3.jpg'
  },
  {
    id: '3',
    title: 'Art',
    price: 0.4,
    inStock: 4,
    img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-4.jpg'
  }
];

export const sampleUserList = [
  {
    id: '1',
    name: 'Kohaku Tora',
    avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-1.jpg',
    bid: 1.46
  },
  {
    id: '2',
    name: 'Raquel Will',
    avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-2.jpg',
    bid: 1.3
  },
  {
    id: '7',
    name: 'Adah Mitchell',
    avatar: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/avatar-7.jpg',
    bid: 1.15
  }
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function dummyFetch() {
  await sleep(1000);
  return sampleData;
}
