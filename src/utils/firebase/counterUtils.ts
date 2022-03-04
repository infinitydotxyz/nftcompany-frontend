import { initializeApp } from 'firebase/app';
// Add Firebase products that you want to use
import { getFirestore, getDoc, doc, onSnapshot } from 'firebase/firestore';
import { Counter } from './Counter';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAGKBT_tFV1F1tVePXpzbWZmJCdfPbj9t0',
  authDomain: 'nftc-dev.firebaseapp.com',
  projectId: 'nftc-dev',
  storageBucket: 'nftc-dev.appspot.com',
  messagingSenderId: '824700732056',
  appId: '1:824700732056:web:b1471c37dbd8afd0cc46ed',
  measurementId: 'G-MXQRY19CMS'
};

export async function initCounter() {
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);

  const docRef = doc(db, 'feed/data/events/event1');

  const docObj = await getDoc(docRef);
  console.log('docRef', docObj.data());

  // Initialize the sharded counter.
  // @ts-ignore
  var views = new Counter(docRef, 'likes');

  // // This will increment a field "stats.views" of the "pages/hello-world" document by 3.
  views.incrementBy(4).then(($: any) => console.log('returning document >>>>', $));
  // // Listen to locally consistent values

  views.onSnapshot((snap: any) => {
    console.log('Locally consistent view of visits: ' + snap.data());
  });

  //Alternatively if you don't mind counter delays, you can listen to the document directly.
  // onSnapshot(doc(db, 'pages', 'hello-world'), (snap) => {
  //   console.log('Eventually consistent view of visits: ' + snap.get('stats.views'));
  // });
}
