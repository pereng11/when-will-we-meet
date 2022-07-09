import React, {
  useState,
  useEffect,
  useRef,
  LegacyRef,
  RefObject,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  createOrUpdateUserThunk,
  getUserData,
} from '../../store/modules/userSlice';

import { logInMethod } from '../publicPages/Login';
import { ChangableUserInfo, UserInfo } from '../../types/user';
import { uploadProfileImage } from '../../api/storage';

export default function Profile() {
  const kakao = window.Kakao;
  const userDataState = useAppSelector((state) => getUserData(state));

  const initialState =
    userDataState && userDataState.info
      ? {
          name: userDataState.info.name,
          profile_image: userDataState.info.profile_image,
        }
      : {
          name: `익명${Math.floor(new Date().getUTCMilliseconds() * 10000000)}`,
          profile_image:
            'https://blog.kakaocdn.net/dn/cnt70G/btrjXFKITaY/FEIe6scpbFA5gWQh4XiYx1/img.png',
        };

  const [profile, setProfile] = useState(initialState);
  const { name, profile_image } = profile;

  const $fileInputRef = useRef<HTMLInputElement>(null);
  const $previewImgRef = useRef<HTMLImageElement>(null);

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

  const onImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const imageSrc = URL.createObjectURL(files[0]);
      setProfile((prev) => {
        return { ...prev, profile_image: imageSrc };
      });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const info: ChangableUserInfo = {
        name,
        profile_image,
      };
      let uploadedImageURL;
      if (
        $fileInputRef.current &&
        $fileInputRef.current.files &&
        $fileInputRef.current.files.length > 0
      ) {
        const imageFile = $fileInputRef.current.files[0];
        uploadedImageURL = await uploadProfileImage(imageFile);
        info.profile_image = uploadedImageURL;
        $fileInputRef.current.value = '';
        $fileInputRef.current.files = null;
      }

      await updateUserProfile(info);
      setProfile({
        name,
        profile_image: uploadedImageURL || profile_image,
      });
    } catch (err) {
      console.log('프로필 편집 에러', err);
    }
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
      <img src={profile_image} />
      <form onSubmit={onSubmit}>
        <input
          type="text"
          minLength={2}
          maxLength={12}
          name="name"
          value={name}
          onChange={onChange}
        />
        <br />
        <input
          type="file"
          name="profile_image"
          accept=".jpg,.png,.bmp,.jpeg"
          onChange={onImageFileChange}
          ref={$fileInputRef}
        />
        <br />
        <button type="submit">프로필 변경</button>
      </form>
      <button type="button" onClick={logout}>
        로그아웃
      </button>
    </div>
  );
}
