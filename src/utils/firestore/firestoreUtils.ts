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
  where,
  updateDoc,
  startAfter,
  Unsubscribe
} from 'firebase/firestore'; // access firestore database service

import { increaseComments, increaseLikes } from './counterUtils';
import { firestoreConfig } from '../../../creds/firestore';
import { FeedEvent } from 'components/app/Feed/FeedItem';

export const COLL_FEED = 'feed'; // collection: /feed - to store feed events
const EVENTS_PER_PAGE = 10;
const COMMENTS_PER_PAGE = 10;

type FeedFilter = {
  type?: FeedEvent;
};

export type Comment = {
  userAddress: string;
  comment: string;
  timestamp: number;
};

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
let lastCommentDoc: any = null;

export async function fetchMoreEvents(filter: FeedFilter) {
  const coll = collection(firestoreDb, COLL_FEED);

  if (lastDoc) {
    let q;
    if (filter?.type) {
      q = query(
        coll,
        where('type', '==', filter?.type),
        orderBy('timestamp', 'desc'),
        limit(EVENTS_PER_PAGE),
        startAfter(lastDoc)
      ); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    } else {
      q = query(coll, orderBy('timestamp', 'desc'), limit(EVENTS_PER_PAGE), startAfter(lastDoc)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    }

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

let unsubscribe: Unsubscribe;
export async function subscribe(collectionPath: string, filter: FeedFilter, onChange: any) {
  try {
    const coll = collection(firestoreDb, collectionPath);

    let q;
    if (filter?.type) {
      q = query(coll, where('type', '==', filter?.type), orderBy('timestamp', 'desc'), limit(EVENTS_PER_PAGE)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    } else {
      q = query(coll, orderBy('timestamp', 'desc'), limit(EVENTS_PER_PAGE)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    }

    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (onChange && change.type === 'added') {
          const docData = { ...change.doc.data(), id: change.doc.id };
          // console.log('docData', docData);
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

export async function addUserComments(eventId: string, userAddress: string, comment: string) {
  const timestamp = +new Date();
  const docRef = doc(firestoreDb, 'feed', eventId, 'userComments', userAddress + '_' + timestamp);
  await setDoc(docRef, { userAddress, comment, timestamp });
  increaseComments(userAddress ?? '', eventId);
}

export async function fetchComments(eventId?: string) {
  if (!eventId) {
    return [];
  }
  try {
    const coll = collection(firestoreDb, `feed/${eventId}/userComments`);
    const q = query(coll, orderBy('timestamp', 'desc'), limit(COMMENTS_PER_PAGE)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      const list: Comment[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data() as Comment;
        // docData.userAddress = doc.id;
        list.push(docData);
      });
      lastCommentDoc = snapshot.docs[snapshot.docs.length - 1];
      return list;
    }
    return [];
  } catch (err) {
    console.error(err);
    throw new Error(`${err}`);
  }
}

export async function fetchMoreComments(eventId?: string) {
  if (!eventId) {
    return [];
  }
  const coll = collection(firestoreDb, `feed/${eventId}/userComments`);

  if (lastCommentDoc) {
    const q = query(coll, orderBy('timestamp', 'desc'), limit(COMMENTS_PER_PAGE), startAfter(lastCommentDoc)); // query(coll, limit(3), orderBy('timestamp', 'desc'))
    const items = await getDocs(q);

    if (items.docs.length > 0) {
      const arr = [];
      for (const item of items.docs) {
        // const docData = { ...item.data(), id: item.id };
        arr.push(item.data());
      }
      lastCommentDoc = items.docs[items.docs.length - 1];
      return arr;
    }
  }
  return [];
}
