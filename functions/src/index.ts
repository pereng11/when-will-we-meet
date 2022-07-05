import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// const kakaoRequestProfileURL =
//   'https://kapi.kakao.com/v2/user/me?secure_resource=true';

// function requestMe(kakaoAccessToken) {
//   //requesting user profile from kakao API server
//   fetch( kakaoRequestProfileURL, {

//   })
// }

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});
