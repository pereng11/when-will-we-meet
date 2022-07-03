import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';
import type { RootState } from '../index';
import { AsyncState, asyncState } from '../../lib/asyncState';
import type { User, UserInfo } from '../../types/user';
import { addUser, getUser } from '../../api/users';

export type UserState = AsyncState<User, Error>;
const initialState: UserState = asyncState.initial({
  info: null,
  logged: false,
  validated: false,
});

export const signInUserThunk = createAsyncThunk(
  'user/add',
  async (user: UserInfo) => addUser(user)
);
export const getUserThunk = createAsyncThunk(
  'user/getById',
  async (id: string) => getUser(id)
);

const thunkAPIs = [signInUserThunk, getUserThunk];

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state: UserState) => {
      return {
        ...state,
        data: {
          info: null,
          logged: false,
          validated: false,
        },
      };
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
            return asyncState.success({
              info: action.payload,
              logged: true,
              validated: true,
            });
          }
        )
        .addCase(thunk.rejected, (state: UserState, action: any) => {
          return asyncState.error(action.error);
        });
    });
  },
});

export const { logout } = userSlice.actions;
export const getUserData = (state: RootState) => state.user.data;
export const getUserStatus = (state: RootState) => state.user.status;
export const getUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
