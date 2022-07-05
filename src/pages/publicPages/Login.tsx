import React, { useState } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import type { User, UserInfo } from '../../types/user';
import {
  getUserData,
  signInUserThunk,
  signoutUserThunk,
} from '../../store/modules/userSlice';
import { useAppSelector, useAppDispatch } from '../../store';

export default function Login() {
  const kakao = window.Kakao;
  const dispatch = useAppDispatch();
  const anonymousSignIn = async () => {
    try {
      const anonymousUser = await signInAnonymously(getAuth());
      if (!anonymousUser) return;

      const newUser: UserInfo = {
        id: anonymousUser.user.uid,
        name: '익명123',
        profile: 'testProfile',
        meetings: [],
      };

      await dispatch(signInUserThunk(newUser));
    } catch (err) {
      //회원가입 실패 에러
    }
  };

  const kakaoSignIn = async () => {
    try {
      kakao.Auth.authorize({
        redirectUri: `http://localhost:3000/register`,
      });
      // const token = kakao.Auth.getAccessToken();
      // console.log(token);
    } catch (err) {
      console.log(err);
      //회원가입 실패 에러
    }
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <button type="button" onClick={anonymousSignIn}>
        익명 로그인
      </button>
      <br />
      <button type="button" onClick={kakaoSignIn}>
        카카오 로그인
      </button>
    </div>
  );
}
