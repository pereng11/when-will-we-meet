import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import app from './index';

const functions = getFunctions(app);

const helloWorld = httpsCallable(functions, 'helloWorld');
const helloOncall = httpsCallable(functions, 'helloOncall');

connectFunctionsEmulator(functions, 'localhost', 5001);

export { helloWorld, helloOncall };

export default functions;
