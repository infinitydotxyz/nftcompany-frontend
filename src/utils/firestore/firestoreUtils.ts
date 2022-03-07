import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  limit,
  orderBy,
  updateDoc,
  startAfter
} from 'firebase/firestore'; // access firestore database service

import { increaseComments, increaseLikes } from './counterUtils';
import { firestoreConfig } from '../../../creds/firestore';

export const COLL_FEED = 'feed'; // collection: /feed - to store feed events

const app = initializeApp(firestoreConfig);

export const firestoreDb = getFirestore();

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
  const coll = collection(firestoreDb, COLL_FEED);

  if (lastDoc) {
    const q = query(coll, orderBy('timestamp', 'asc'), limit(2), startAfter(lastDoc)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    const items = await getDocs(q);

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

    const q = query(coll, orderBy('timestamp', 'asc'), limit(2)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
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

export async function addUserLike(eventId: string, userAccount: string, doneCallback: () => void) {
  const docRef = doc(firestoreDb, 'feed', eventId, 'userLikes', userAccount);
  const existingDocRef = await getDoc(docRef);
  const existingDocData = existingDocRef?.data();
  if (!existingDocData) {
    // user has not liked this eventId before => setDoc to userLikes & call increaseLikes:
    await setDoc(docRef, { timestamp: +new Date() });
    increaseLikes(userAccount ?? '', eventId);
    doneCallback();
  }
}

export async function addUserComments(eventId: string, userAccount: string, comment: string, doneCallback: () => void) {
  const timestamp = +new Date();
  const docRef = doc(firestoreDb, 'feed', eventId, 'userComments', userAccount + '_' + timestamp);
  await setDoc(docRef, { comment, timestamp });
  increaseComments(userAccount ?? '', eventId);
  doneCallback();
}
