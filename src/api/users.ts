import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { User, UserInfo } from '../types/user';

const USERS_COLLECTION = 'users';

const addUser = async (userInfo: UserInfo): Promise<UserInfo> => {
  if (!userInfo) return null;

  try {
    await setDoc(doc(db, USERS_COLLECTION, userInfo.id), userInfo);
    return userInfo;
  } catch (err: any) {
    console.error('Error adding document: ', err);
    throw new Error(err);
  }
};

const getUser = async (id: string): Promise<UserInfo> => {
  try {
    const userRef = collection(db, USERS_COLLECTION);
    const q = query(userRef, where('id', '==', id));
    const userSnapshot = await getDocs(q);
    let userInfo: UserInfo = null;
    userSnapshot.forEach((user: any) => {
      userInfo = user.data();
    });
    return userInfo;
  } catch (err: any) {
    console.error('Error adding document: ', err);
    throw new Error(err);
  }
};

export { addUser, getUser };
