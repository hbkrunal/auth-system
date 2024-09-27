import { IUser } from '../component/header/header.utils';

export interface IAuthSignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAuthLoginPayload {
  email: string;
  password: string;
}

export interface IAuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface IAuthResponse extends IAuthTokens {
  user: IUser;
}
