import express from 'express';
import axios from 'axios';
import { admin } from '../configs/firebase';
import { UserRecord } from 'firebase-functions/v1/auth';

const kakaoRoutes = express.Router();

const KAKAO = 'KAKAO';

type AuthQuery = {
  code?: string;
};

type Token =
  | {
      token_type: string;
      access_token: string;
      id_token?: string;
      expires_in: number;
      refresh_token: string;
      refresh_token_expires_in: number;
      scope: string;
    }
  | undefined;

type UserInfo = {
  uid: string;
  email?: string;
  nickname?: string;
  profile_image?: string;
  provider: string;
};

kakaoRoutes.get('/', (req, res) => {
  res.send('kakao check');
});

kakaoRoutes.get('/auth', async (req, res) => {
  try {
    const query: AuthQuery = req.query;
    if (!query.code) {
      res.send('인가 코드가 존재하지 않습니다');
    } else {
      const authCode = query.code;
      const kakaoToken = await requestToken(authCode);
      //토큰 유효성 검사 함수 필요
      if (!kakaoToken || !kakaoToken.access_token) {
        throw new Error('카카오 토큰이 존재하지 않습니다');
      }

      const firebaseToken = await createFirebaseToken(kakaoToken.access_token);
      if (!firebaseToken) {
        throw new Error('파이어베이스 토큰 생성에 실패하였습니다');
      }
      res.cookie('firebase_token', firebaseToken, {
        httpOnly: false,
        secure: false,
      });
      res.redirect('http://localhost:3000/login');
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

const requestToken = async (authCode: string): Promise<Token> => {
  try {
    const requestTokenURL = `${process.env.KAKAO_AUTH_HOST_URL}/oauth/token`;
    const response = await axios.post(
      requestTokenURL,
      {},
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_API_KEY,
          code: authCode,
          redirect_uri: process.env.KAKAO_TOKEN_REDIRECT_LOCAL_URI,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error('카카오 토큰 발급 오류');
  }
};

const requestProfile = async (accessToken: string) => {
  try {
    const requestProfileURL = `${process.env.KAKAO_API_HOST_URL}/v2/user/me`;
    const response = await axios.post(
      requestProfileURL,
      {
        secure_resource: true,
        property_keys: ['profile_nickname', 'profile_image'],
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error('카카오 프로필 정보 발급 오류');
  }
};

const createOrGetUser = async (info: UserInfo): Promise<UserRecord> => {
  const { uid } = info;
  try {
    const user = await admin.auth().createUser(info);
    console.log(`새로운 유저: ${user}`);
    return user;
  } catch (err: any) {
    if (err.code === 'auth/uid-already-exists') {
      const existingUser = await admin.auth().getUser(uid);
      console.log(`기존유저: ${existingUser}`);
      return existingUser;
    }
    console.log('파이어베이스 auth user 생성 오류!!!!!!!!');
    throw new Error(err);
  }
};

const createFirebaseToken = async (kakaoAccessToken: string) => {
  try {
    const profile = await requestProfile(kakaoAccessToken);
    if (!profile || !profile.id) {
      throw new Error('유저가 존재하지 않습니다');
    }

    console.log(profile);

    const userInfo: UserInfo = {
      uid: `kakao${profile.id}`,
      provider: KAKAO,
    };
    const userRecord = await createOrGetUser(userInfo);
    if (!userRecord) {
      throw new Error('파이어베이스 auth 생성 오류');
    }

    const userId = userRecord.uid;
    const firebaseToken = await admin
      .auth()
      .createCustomToken(userId, { provider: KAKAO });
    return firebaseToken;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default kakaoRoutes;
