import {
  getFirestore,
  collection,
  QueryDocumentSnapshot,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { UserInfo } from '../types/user';
import app from './index';

const firestore = getFirestore(app);

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) => {
  return collection(firestore, collectionPath).withConverter(converter<T>());
};

const db = {
  users: dataPoint<UserInfo>('users'),
};

connectFirestoreEmulator(firestore, 'localhost', 8080);

export { db };

export default firestore;
