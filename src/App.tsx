import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserThunk, signoutUserThunk } from './store/modules/userSlice';
import { PrivateRoute, PublicRoute } from './routes';
import { useAppDispatch } from './store';

import Login from './pages/publicPages/Login';
import Register from './pages/publicPages/Register';
import MainPage from './pages/privatePages/MainPage';
import { PublicCommonPage } from './pages/publicPages/Sample';

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

        await dispatch(signoutUserThunk());

        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="App">
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/anyone" element={<PublicCommonPage />} />
        </Route>
        <Route element={<PublicRoute restricted />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<MainPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
