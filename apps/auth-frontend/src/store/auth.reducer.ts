// auth.reducer.ts
import { Action, createReducer, on } from '@ngrx/store';
import {
  loadData,
  loginAction,
  logoutAction,
  restoreSessionAction,
  signupAction,
} from './auth.actions';
import { IUser } from '../component/header/header.utils';

export interface AuthState {
  user: IUser | null;
}

export interface AppState {
  auth: AuthState;
}

export const initialState: AuthState = {
  user: null,
};

const _authReducer = createReducer(
  initialState,
  on(loadData, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(loginAction, (state, { user }) => ({ ...state, user: user })),
  on(signupAction, (state, { user }) => ({ ...state, user: user })),
  on(restoreSessionAction, (state, { user }) => ({ ...state, user: user })),
  on(logoutAction, (state) => ({ ...state, user: null }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return _authReducer(state, action);
}
