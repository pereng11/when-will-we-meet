import React, { useState } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';
import type { User, UserInfo } from '../types/user';
import {
  getUserData,
  signInUserThunk,
  signoutUserThunk,
} from '../store/modules/userSlice';
import { useAppSelector, useAppDispatch } from '../store';

export default function TestUserInput() {
  const [name, setname] = useState('');

  const user = useAppSelector((state) => getUserData(state));
  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setname(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name);
    setname('');
  };

  const logUserInfo = async () => {
    const auth = getAuth();
    console.log(auth.currentUser?.uid);
  };

  const anonymousSignIn = async () => {
    try {
      const anonymousUser = await signInAnonymously(getAuth());
      if (!anonymousUser) return;

      const newUser: UserInfo = {
        id: anonymousUser.user.uid,
        name: 'testName',
        profile: 'testProfile',
        meetings: [],
      };

      await dispatch(signInUserThunk(newUser));
    } catch (err) {}
  };

  const signOut = () => {
    dispatch(signoutUserThunk());
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="test-user-input">닉네임</label>
        <input
          id="test-user-input"
          type="text"
          onChange={onChange}
          value={name}
        />
        <button type="submit">프로필 등록</button>
      </form>
      <ul></ul>

      <button type="button" onClick={logUserInfo}>
        유저정보 가져오기
      </button>
      <button type="button" onClick={anonymousSignIn}>
        익명유저 가입하기
      </button>
      <button type="button" onClick={signOut}>
        로그아웃
      </button>
    </div>
  );
}
