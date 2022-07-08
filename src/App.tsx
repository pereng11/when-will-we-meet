import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { getUserThunk, logoutUserThunk } from './store/modules/userSlice';
import { PrivateRoute, PublicRoute } from './routes';
import { useAppDispatch } from './store';

import Login from './pages/publicPages/Login';
import Profile from './pages/privatePages/Profile';
import MainPage from './pages/privatePages/MainPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoading(true);

        const uid = user.uid;
        await dispatch(getUserThunk(uid));

        setIsLoading(false);
      } else {
        setIsLoading(true);

        await dispatch(logoutUserThunk());

        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="App">
      <Routes>
        <Route element={<PublicRoute />}></Route>
        <Route element={<PublicRoute restricted />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<MainPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
