import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';
import { getUserData } from '../store/modules/userSlice';

export function PrivateRoute() {
  const user = useAppSelector((state) => getUserData(state));
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !user.validated) {
      navigate('/login', { replace: true });
    }
  });

  return <Outlet />;
}

type PublicRouteProps = {
  restricted?: boolean;
};

export function PublicRoute({ restricted }: PublicRouteProps) {
  const user = useAppSelector((state) => getUserData(state));
  const navigate = useNavigate();
  useEffect(() => {
    if (restricted && user?.validated) {
      navigate('/home', { replace: true });
    }
  });
  return <Outlet />;
}
