// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getFirebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(getFirebaseConfig());
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export default app;
