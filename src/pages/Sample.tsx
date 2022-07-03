import React from 'react';
import { useAppSelector } from '../store';
import { getUserData } from '../store/modules/userSlice';
import TestUserInput from '../components/TestUserInput';

export function PrivatePage() {
  const user = useAppSelector((state) => getUserData(state));
  return (
    <div>
      메인화면
      <TestUserInput />
    </div>
  );
}

export function PublicCommonPage() {
  const user = useAppSelector((state) => getUserData(state));
  return (
    <div>
      아무나 볼 수 있는 화면
      <TestUserInput />
    </div>
  );
}

export function PublicRestrictedPage() {
  const user = useAppSelector((state) => getUserData(state));
  return (
    <div>
      로그인 화면
      <TestUserInput />
    </div>
  );
}
