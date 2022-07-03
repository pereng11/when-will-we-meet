import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserThunk, signoutUserThunk } from './store/modules/userSlice';
import TestUserInput from './components/TestUserInput';
import { PrivateRoute, PublicRoute } from './routes';
import {
  PrivatePage,
  PublicCommonPage,
  PublicRestrictedPage,
} from './pages/Sample';
import { useAppDispatch } from './store';

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
          <Route path="/login" element={<PublicRestrictedPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<PrivatePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
