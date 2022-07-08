import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../service-account.json';
// import * as functions from 'firebase-functions';

// admin.initializeApp();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});
// admin.initializeApp({
//   credential: admin.credential.cert({
//     privateKey: functions.config().private.key.replace(/\\n/g, '\n'),
//     projectId: functions.config().project.id,
//     clientEmail: functions.config().client.email,
//   }),
//   databaseURL: `https://${functions.config().project.id}.firebaseio.com`,
// });

const db = admin.firestore();
export { admin, db };
