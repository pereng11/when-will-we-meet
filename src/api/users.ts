import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from '../types/user';

const USERS_COLLECTION = 'users';

const addUser = async (user: User) => {
  if (!user) return;

  try {
    await setDoc(doc(db, USERS_COLLECTION, user.id), user);
    return user;
  } catch (err: any) {
    console.error('Error adding document: ', err);
    throw new Error(err);
  }
};

const getUser = async (id: string) => {
  try {
    const userRef = collection(db, USERS_COLLECTION);
    const q = query(userRef, where('id', '==', id));
    const userSnapshot = await getDocs(q);
    let user: User = null;
    userSnapshot.forEach((user: any) => {
      user = user.data();
    });
    return user;
  } catch (err: any) {
    console.error('Error adding document: ', err);
    throw new Error(err);
  }
};

export { addUser, getUser };
