import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import type { UserInfo } from '../types/user';

const USERS_COLLECTION = db.users;

const createOrUpdateUser = async (userInfo: UserInfo): Promise<UserInfo> => {
  if (!userInfo) return null;

  try {
    await setDoc(doc(USERS_COLLECTION, userInfo.id), userInfo);
    return userInfo;
  } catch (err: any) {
    console.error('Error adding document: ', err);
    throw new Error(err);
  }
};

const getUser = async (id: string): Promise<UserInfo> => {
  try {
    const userRef = doc(USERS_COLLECTION, id);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      return null;
    }
    const userInfo = userSnapshot.data();
    return userInfo;
  } catch (err: any) {
    console.error('Error adding document: ', err);
    throw new Error(err);
  }
};

export { createOrUpdateUser, getUser };
