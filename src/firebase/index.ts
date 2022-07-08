// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
  CollectionReference,
  collection,
  DocumentData,
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from 'firebase/functions';
import { getFirebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(getFirebaseConfig());

//cloud functions
const functions = getFunctions(app);
const helloWorld = httpsCallable(functions, 'helloWorld');
const helloOncall = httpsCallable(functions, 'helloOncall');

connectFunctionsEmulator(functions, 'localhost', 5001);

//auth
const auth = getAuth();
connectAuthEmulator(auth, 'http://localhost:9099');

//firestore
const db = getFirestore(app);

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

connectFirestoreEmulator(db, 'localhost', 8080);

export { helloWorld, helloOncall, db, createCollection };
export default app;
