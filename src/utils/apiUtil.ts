// import axios from 'axios'

export const sampleData = [
  {
    id: '1',
    title: 'Amazing Art',
    price: 0.1,
    inStock: 1,
    img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-1.jpg'
  },
  {
    id: '2',
    title: 'Ribbon Hunter',
    price: 0.2,
    inStock: 2,
    img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-2.jpg'
  },
  {
    id: '3',
    title: 'Gems',
    price: 0.3,
    inStock: 3,
    img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-3.jpg'
  },
  {
    id: '4',
    title: 'Art',
    price: 0.4,
    inStock: 4,
    img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-4.jpg'
  }
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function dummyFetch() {
  await sleep(1000);
  return sampleData;
}
