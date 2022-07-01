import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { combineReducers } from 'redux';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import user from './modules/userSlice';

const rootReducer = combineReducers({
  user,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
