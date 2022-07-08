import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  createOrUpdateUserThunk,
  getUserData,
} from '../../store/modules/userSlice';

import { logInMethod } from '../publicPages/Login';
import { ChangableUserInfo, UserInfo } from '../../types/user';

export default function Profile() {
  const kakao = window.Kakao;
  const userDataState = useAppSelector((state) => getUserData(state));
  const [profile, setProfile] = useState({
    name: `익명${Math.floor(Math.random() * 100000000)}`,
    profile_image: '기본 프로필 이미지 주소',
  });
  const { name, profile_image } = profile;
  const dispatch = useAppDispatch();

  const logout = async () => {
    if (!userDataState || !userDataState.info) return;

    const currentLogInMethod = userDataState.info.method;
    if (currentLogInMethod === logInMethod.kakao) {
      kakao.Auth.logout();
    }
    signOut(getAuth());
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const info: ChangableUserInfo = {
      name,
      profile_image,
    };
    await updateUserProfile(info);
    console.log('submit');
  };

  const updateUserProfile = async (targetInfo: ChangableUserInfo) => {
    if (!userDataState || !userDataState.info) return;
    try {
      const newUserInfo: UserInfo = {
        ...userDataState.info,
        ...targetInfo,
      };
      await dispatch(createOrUpdateUserThunk(newUserInfo));
    } catch (err: any) {
      throw new Error('프로필 업데이트 오류', err);
    }
  };

  useEffect(() => {
    if (!userDataState || !userDataState.info) return;
    const { name, profile_image } = userDataState.info;
    if (name !== '') {
      setProfile({ name: name, profile_image });
    }
  }, []);
  return (
    <div>
      <h1>프로필설정 페이지</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          minLength={2}
          maxLength={12}
          name="name"
          value={name}
          onChange={onChange}
        />
        <input
          type="text"
          minLength={2}
          maxLength={50}
          name="profile_image"
          value={profile_image}
          onChange={onChange}
        />
        <button type="submit">프로필 변경</button>
      </form>
      <button type="button" onClick={logout}>
        로그아웃
      </button>
    </div>
  );
}
