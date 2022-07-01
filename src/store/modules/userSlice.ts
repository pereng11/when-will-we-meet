import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { AsyncState, asyncState } from '../../lib/asyncState';
import type { User } from '../../types/user';
import { addUser, getUser } from '../../api/users';

export type UserState = AsyncState<User, Error>;
const initialState: UserState = asyncState.initial(null);

export const addUserThunk = createAsyncThunk(
  'user/userAPI',
  async (user: User) => addUser(user)
);
export const getUserThunk = createAsyncThunk(
  'user/userAPI',
  async (id: string) => getUser(id)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    refreshUser: (state: UserState, action: PayloadAction<User>) => {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserThunk.pending, (state: UserState, action) => {
        return asyncState.loading(state.data);
      })
      .addCase(addUserThunk.fulfilled, (state: UserState, action: any) => {
        return asyncState.success(action.payload);
      })
      .addCase(addUserThunk.rejected, (state: UserState, action: any) => {
        return asyncState.error(action.error);
      });
  },
});

export const { refreshUser } = userSlice.actions;
export const getUserData = (state: RootState) => state.user.data;
export const getUserStatus = (state: RootState) => state.user.status;
export const getUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
