import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(getFirebaseConfig());

connectAuthEmulator(getAuth(), 'http://localhost:9099');

export default app;
