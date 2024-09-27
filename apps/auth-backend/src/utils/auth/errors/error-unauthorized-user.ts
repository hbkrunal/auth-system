import { BaseError } from '../../errors/base-error';
import { ErrorCategories } from '../../errors/error-categories';
import { AuthErrorCodeEnum } from './auth-error-code';

export class ErrorUnauthorizedUser extends BaseError {
  constructor(error?: any) {
    const message = 'Unauthorized: Access is denied';
    super(ErrorCategories.Unauthorized);
    this.updateError(AuthErrorCodeEnum.errorUnauthorizedUser, message, error);
  }
}
