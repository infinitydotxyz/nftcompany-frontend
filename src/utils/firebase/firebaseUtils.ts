import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  limit,
  orderBy,
  updateDoc,
  startAfter
} from 'firebase/firestore'; // access firestore database service

import { Counter } from './Counter';

const firebaseConfig = {
  apiKey: 'AIzaSyAGKBT_tFV1F1tVePXpzbWZmJCdfPbj9t0',
  authDomain: 'nftc-dev.firebaseapp.com',
  projectId: 'nftc-dev',
  storageBucket: 'nftc-dev.appspot.com',
  messagingSenderId: '824700732056',
  appId: '1:824700732056:web:b1471c37dbd8afd0cc46ed',
  measurementId: 'G-MXQRY19CMS'
};

const app = initializeApp(firebaseConfig);

export const firestoreDb = getFirestore();

// onSnapshot(doc(firestoreDb, 'feed', 'data', 'events', 'event2'), (doc) => {
//   console.log('doc', doc);
// });

export async function getCollectionDocs(collectionPath: string, onChange: any) {
  try {
    const coll = collection(firestoreDb, collectionPath);
    const snapshot = await getDocs(coll);
    const list = snapshot.docs.map((doc) => doc.data());
    return list;
  } catch (err) {
    console.error(err);
    throw new Error(`${err}`);
  }
}

let lastDoc: any = null;

export async function fetchMoreEvents() {
  const coll = collection(firestoreDb, 'feed/data/events');

  if (lastDoc) {
    const q = query(coll, orderBy('datetime', 'asc'), limit(2), startAfter(lastDoc)); // query(coll, limit(3), orderBy('datetime', 'desc'))
    const items = await getDocs(q);
    // console.log('--- items.docs.length', items.docs.length);

    if (items.docs.length > 0) {
      const arr = [];
      for (const item of items.docs) {
        const docData = { ...item.data(), id: item.id };
        arr.push(docData);
      }
      lastDoc = items.docs[items.docs.length - 1];
      return arr;
    }
  }
  return [];
}

export async function subscribe(collectionPath: string, onChange: any) {
  try {
    const coll = collection(firestoreDb, collectionPath);

    const q = query(coll, orderBy('datetime', 'asc'), limit(2)); // query(coll, limit(3), orderBy('datetime', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (onChange && change.type === 'added') {
          const docData = { ...change.doc.data(), id: change.doc.id };
          console.log('docData', docData);
          lastDoc = change.doc;
          onChange(change.type, docData);
        }
      });
    });
    return unsubscribe;
  } catch (err) {
    console.error(err);
    throw new Error(`${err}`);
  }
}

export async function updateCollectionDoc(path: string, docId: string, data: any) {
  const docRef = doc(firestoreDb, path, docId);
  await updateDoc(docRef, data);
}

// Initialize the sharded counter.
// const firestore = getFirestore(app);
// var visits = new Counter(firestore, firestoreDb, 'feed/data/events/event2', 'visits');
// // Increment the field "visits" of the document "pages/hello-world".
// visits.incrementBy(1);
// Listen to locally consistent values.
// visits.onSnapshot((snap) => {
//   console.log('Locally consistent view of visits: ' + snap.data());
// });

// Alternatively, if you don't mind counter delays, you can listen to the document directly.
// const docRef = doc(firestoreDb, path, docId);
// firestoreDb.doc('pages/hello-world').onSnapshot((snap) => {
//   console.log('Eventually consistent view of visits: ' + snap.get('visits'));
// });
