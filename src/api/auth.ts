import {
  Auth,
  getAuth,
  signInAnonymously as firebaseAnonymousSignIn,
} from 'firebase/auth';

const signInAnonymously = async () => {
  try {
    const auth = getAuth();
    const user = await firebaseAnonymousSignIn(auth);
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

export { signInAnonymously };
