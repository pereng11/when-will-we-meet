import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Auth, getAuth, signOut } from 'firebase/auth';
import { createOrUpdateUser, getUser } from '../../api/users';
import { AsyncState, asyncState } from '../../lib/asyncState';
import type { RootState } from '../index';
import type { User, UserInfo } from '../../types/user';
import storage from '../../lib/storage';

const STORAGE_KEY = 'wwwmUserInfo';

export type UserState = AsyncState<User, Error>;
const initialState: UserState = asyncState.initial({
  info: null,
  validated: false,
});

export const createOrUpdateUserThunk = createAsyncThunk(
  'user/add',
  async (user: UserInfo) => {
    const newUser = await createOrUpdateUser(user);
    storage.set(STORAGE_KEY, user);
    return newUser;
  }
);
export const getUserThunk = createAsyncThunk(
  'user/getById',
  async (id: string) => {
    const user: UserInfo = await getUser(id);
    storage.set(STORAGE_KEY, user);
    return user;
  }
);

const thunkAPIs = [createOrUpdateUserThunk, getUserThunk];

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logInUser: (state: UserState, action: PayloadAction<UserInfo>) => {
      return asyncState.success({
        info: action.payload,
        validated: true,
      });
    },
    logOutUser: () => {
      return asyncState.success({
        info: null,
        validated: false,
      });
    },
  },
  extraReducers: (builder) => {
    thunkAPIs.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state: UserState, action) => {
          return asyncState.loading(state.data);
        })
        .addCase(
          thunk.fulfilled,
          (state: UserState, action: PayloadAction<UserInfo>) => {
            const userInfo = action.payload;
            return asyncState.success({
              info: userInfo,
              validated: userInfo ? true : false,
            });
          }
        )
        .addCase(thunk.rejected, (state: UserState, action: any) => {
          return asyncState.error(action.error);
        });
    });
  },
});
export const { logInUser, logOutUser } = userSlice.actions;

export const getUserData = (state: RootState) => state.user.data;
export const getUserStatus = (state: RootState) => state.user.status;
export const getUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
