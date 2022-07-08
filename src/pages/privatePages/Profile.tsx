import React, { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../store';
import { getUserData } from '../../store/modules/userSlice';

import { logInMethod } from '../publicPages/Login';

export default function Profile() {
  const kakao = window.Kakao;
  const userDataState = useAppSelector((state) => getUserData(state));

  const dispatch = useAppDispatch();

  const logout = async () => {
    if (!userDataState || !userDataState.info) return;

    const currentLogInMethod = userDataState.info.method;
    if (currentLogInMethod === logInMethod.kakao) {
      kakao.Auth.logout();
    }
    signOut(getAuth());
  };

  useEffect(() => {
    console.log(userDataState);
  }, []);
  return (
    <div>
      <h1>프로필설정 페이지</h1>
      <button type="button"></button>

      <button type="button" onClick={logout}>
        로그아웃
      </button>
    </div>
  );
}
