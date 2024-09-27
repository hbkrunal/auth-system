import { InjectModel } from '@nestjs/mongoose';
import { User } from 'apps/auth-backend/src/database/models/user.model';
import { BaseError } from 'apps/auth-backend/src/utils/errors/base-error';
import { ErrorCategories } from 'apps/auth-backend/src/utils/errors/error-categories';
import { WinstonLogger } from 'apps/auth-backend/src/utils/logger/WinstonLogger';
import { MongoIdType } from 'apps/auth-backend/src/utils/types/core';
import { Model } from 'mongoose';
import { UserMapper } from '../mappers/user-mapper';

export enum UserErrorCodeEnum {
  ErrorUserForbidden = 'ERR_USER_FORBIDDEN',
  ErrorUserNotFound = 'ERR_USER_NOT_FOUND',
  ErrorUserValidation = 'ERR_USER_VALIDATION',
  ErrorUpdateProfile = 'ERR_UPDATE_USER_PROFILE',
  ErrorUpdateSocialMedia = 'ERR_UPDATE_USER_SOCIAL_MEDIA',
}



export class UserService {
  private AuthError: BaseError;
  constructor(
    @InjectModel(User.name) private  userModel: Model<User>,
    private logger?: WinstonLogger,
  ) {
    this.AuthError = new BaseError(ErrorCategories.Authentication);
  }

  async getUser(userId: string | MongoIdType) {
    try {
      this.logger.info(`User : ${userId} | Executing get current User.`);
      const user = await this.userModel.findById(userId);

      if (!user) {
        return this.AuthError.updateError(
          UserErrorCodeEnum.ErrorUserNotFound,
          'User Not Found !',
        );
      }
      this.logger.info(`User : ${userId} | Successfully get current User.`);

      return UserMapper.toDisplay(user);
    } catch (error) {
      return this.AuthError.updateError(
        UserErrorCodeEnum.ErrorUpdateProfile,
        'There was error in get current user',
        error,
      );
    }
  }
  
}
