export interface AsyncState<T, E = any> {
  data: T | null;
  status: 'INIT' | 'LOADING' | 'SUCCESS' | 'ERROR';
  error: E | null;
}

export const asyncState = {
  initial: <T, E = any>(initialData?: T): AsyncState<T, E> => ({
    status: 'INIT',
    data: initialData || null,
    error: null,
  }),
  loading: <T, E = any>(data?: T): AsyncState<T, E> => ({
    status: 'LOADING',
    data: data || null,
    error: null,
  }),
  success: <T, E = any>(data: T): AsyncState<T, E> => ({
    status: 'SUCCESS',
    data,
    error: null,
  }),
  error: <T, E>(error: E): AsyncState<T, E> => ({
    status: 'ERROR',
    data: null,
    error,
  }),
};
