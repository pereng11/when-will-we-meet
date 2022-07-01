import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import type { User } from '../types/user';
import { signInAnonymously } from '../api/signin';
import {
  getUserData,
  addUserThunk,
  getUserThunk,
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
    console.log(user);
  };

  const anonymousSignIn = async () => {
    try {
      const anonymousUser = await signInAnonymously();
      if (!anonymousUser) return;

      const newUser: User = {
        id: anonymousUser.user.uid,
        name: 'testName',
        profile: 'testProfile',
        meetings: [],
      };

      await dispatch(addUserThunk(newUser));
    } catch (err) {}
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
    </div>
  );
}
