import React, { useState, useEffect } from 'react';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  UserCredential,
} from 'firebase/auth';

import { getCookie, removeCookie } from '../../lib/cookies';
import type { UserInfo } from '../../types/user';
import {
  logInUser,
  createOrUpdateUserThunk,
  getUserData,
} from '../../store/modules/userSlice';
import { useAppSelector, useAppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../api/users';

export const logInMethod = {
  kakao: 'KAKAO',
  anonymously: 'ANONYMOUSLY',
};

export default function Login() {
  const kakao = window.Kakao;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userData = useAppSelector((state) => getUserData(state));

  const requestAnonymousLogIn = () => {
    logIn(logInMethod.anonymously);
  };

  const requestKakaoLogIn = async () => {
    const LOCAL_URL = `http://localhost:${process.env.REACT_APP_FIREBASE_FUNCTIONS_LOCAL_PORT}/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/${process.env.REACT_APP_FIREBASE_FUNCTIONS_LOCAL_REGION}`;

    const redirectUri = `${LOCAL_URL}/api/kakao/auth`;
    try {
      kakao.Auth.authorize({
        redirectUri,
      });
    } catch (err) {
      console.log(err);
      //카카오 회원가입 시도 에러
    }
  };

  const logIn = async (method: string, firebaseToken?: string) => {
    try {
      let userCredential: UserCredential;
      switch (method) {
        case logInMethod.anonymously:
          userCredential = await signInAnonymously(getAuth());
          break;
        case logInMethod.kakao:
          if (!firebaseToken) return;
          userCredential = await signInWithCustomToken(
            getAuth(),
            firebaseToken
          );
          break;
        default:
          throw new Error('잘못된 로그인 방식입니다');
      }
      if (!userCredential) {
        throw new Error('로그인 중 오류가 발생하였습니다');
      }
      const userId = userCredential.user.uid;
      const existingUser = await getUser(userId);
      if (existingUser) {
        dispatch(logInUser(existingUser));
        navigate('/home');
      } else {
        const newUser: UserInfo = {
          id: userCredential.user.uid,
          name: '',
          profile_image: '',
          method,
          meetings: [],
        };
        await dispatch(createOrUpdateUserThunk(newUser));
        navigate('/profile');
      }
    } catch (err) {
      //회원가입 실패 에러
      console.log(err);
    }
  };

  useEffect(() => {
    const FIREBASE_TOKEN = 'firebase_token';
    const firebaseToken = getCookie(FIREBASE_TOKEN);
    if (firebaseToken) {
      removeCookie(FIREBASE_TOKEN);
      logIn(logInMethod.kakao, firebaseToken);
    }
  }, []);

  return (
    <div>
      <h1>로그인 페이지</h1>
      <button type="button" onClick={requestAnonymousLogIn}>
        익명 로그인
      </button>
      <br />
      <button type="button" onClick={requestKakaoLogIn}>
        카카오 로그인
      </button>
    </div>
  );
}
