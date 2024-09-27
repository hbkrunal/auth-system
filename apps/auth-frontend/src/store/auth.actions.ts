import { createAction, props } from '@ngrx/store';
import { IAuthResponse } from './auth.inerface';
import { IUser } from '../component/header/header.utils';

export const loadData = createAction('[Auth] LoadData');

export const loadDataFailure = createAction(
  '[Auth] loadDataFailure',
  props<{ error: any }>()
);

export const signupAction = createAction(
  '[Auth] Signup',
  props<{ user: IUser }>()
);

export const loginAction = createAction(
  '[Auth] Login',
  props<{ user: IUser }>()
);

export const restoreSessionAction = createAction(
  '[Auth] Restore Session Action',
  props<{ user: IUser }>()
);

export const logoutAction = createAction('[Auth] Logout Action');
