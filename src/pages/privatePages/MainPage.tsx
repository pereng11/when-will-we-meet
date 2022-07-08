import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

export default function MainPage() {
  const logout = () => {
    signOut(getAuth());
  };
  return (
    <div>
      <h1>메인 페이지</h1>
      <button type="button" onClick={logout}>
        로그아웃
      </button>
    </div>
  );
}
