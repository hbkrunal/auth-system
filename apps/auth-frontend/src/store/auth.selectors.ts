// auth.selectors.ts
import { createSelector } from '@ngrx/store';
import { AppState } from './auth.reducer'; // Ensure the import path is correct

export const selectAuthState = (state: AppState) => state.auth;

export const selectUser = createSelector(selectAuthState, (authState) => {
  return authState.user;
});
