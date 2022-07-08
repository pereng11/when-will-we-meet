import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { User, UserInfo } from '../types/user';

const USERS_COLLECTION = 'users';

const createOrUpdateUser = async (userInfo: UserInfo): Promise<UserInfo> => {
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
    const userRef = doc(db, USERS_COLLECTION, id);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      return null;
    }
    const userInfo = userSnapshot.data() as UserInfo;
    return userInfo;
  } catch (err: any) {
    console.error('Error adding document: ', err);
    throw new Error(err);
  }
};

export { createOrUpdateUser, getUser };
