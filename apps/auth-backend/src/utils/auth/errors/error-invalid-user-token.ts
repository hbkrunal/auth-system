import { AuthErrorCodeEnum } from './auth-error-code';
import { ErrorCategories } from '../../errors/error-categories';
import { BaseError } from '../../errors/base-error';

export class ErrorInvalidUserToken extends BaseError {
  constructor(error?: any) {
    const message = 'Unauthorized: Invalid User Token';
    super(ErrorCategories.Unauthorized);
    this.updateError(AuthErrorCodeEnum.errorInvalidUserToken, message, error);
  }
}
