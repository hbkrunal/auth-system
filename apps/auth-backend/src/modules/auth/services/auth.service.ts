import { RegisterPostDto } from '../dto/register-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthMapper } from '../mappers/auth-mappers';
import { BaseError } from 'apps/auth-backend/src/utils/errors/base-error';
import { User } from 'apps/auth-backend/src/database/models/user.model';
import { WinstonLogger } from 'apps/auth-backend/src/utils/logger/WinstonLogger';
import { ErrorCategories } from 'apps/auth-backend/src/utils/errors/error-categories';
import { LoginPostDto } from '../dto/login-post.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { TokenProvider } from 'apps/auth-backend/src/utils/helpers/token.provider';
import * as bcrypt from 'bcrypt';

export enum AuthErrorCodeEnum {
  ErrorAuthForbidden = 'ERR_AUTH_FORBIDDEN',
  ErrorAuthUserAlreadyExists = 'ERR_AUTH_USER_ALREADY_EXISTS',
  ErrorLoginUser = 'ERR_AUTH_USER_LOGIN',
  ErrorRegisterUser = 'ERR_AUTH_USER_REGISTER',
  ErrorAuthValidation = 'ERR_AUTH_VALIDATION',
  ErrorGetAccessToken = 'ERR_GET_ACCESS_TOKEN',
  ErrorAuthNotFound = 'ERR_AUTH_NOT_FOUND',
  ErrorAuthPasswordNotMatch = 'ERR_AUTH_PASSWORD_NOT_MATCH',
}

export interface AuthTokensInterface {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  BaseError: BaseError;
  constructor(
    @InjectModel(User.name) private  userModel: Model<User>,
    private logger?: WinstonLogger,
    private tokenProvider?: TokenProvider
  ) {
    this.BaseError = new BaseError(ErrorCategories.Authentication);
    this.logger.setContext(ErrorCategories.Authentication);
  }

  async registerUser(register: RegisterPostDto) {
    try {
      this.logger.info(
        `Auth | Start Executing Register user with Email : ${register.email}`
      );

      const isUserExist = await this.userModel.findOne({
        email: register.email,
      });
      if (isUserExist) {
        return this.BaseError.updateError(
          AuthErrorCodeEnum.ErrorAuthUserAlreadyExists,
          'User with this email already exists.'
        );
      }
      //Hash Password 
      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(register.password, saltOrRounds);
      register.password = hashPassword
      const user = new this.userModel(register);

      await user.save();

      const accessToken = await this.tokenProvider.createAccessToken({
        sub: user.id,
      });
      const refreshToken = await this.tokenProvider.createRefreshToken({
        sub: user.id,
      });

      this.logger.info(
        `Auth | User Register successfully with Email : ${register.email}`
      );
      return AuthMapper.toDisplay({ accessToken, refreshToken }, user);
    } catch (error) {
      return this.BaseError.updateError(
        AuthErrorCodeEnum.ErrorAuthValidation,
        `There was an error in register user`,
        error
      );
    }
  }

  async login(loginPostDto: LoginPostDto) {
    try {
      this.logger.info(
        `Auth | Start Executing Login user with Email : ${loginPostDto.email}`
      );
      const user = await this.userModel.findOne({
        email: loginPostDto.email,
      });
      if (!user) {
        return this.BaseError.updateError(
          AuthErrorCodeEnum.ErrorAuthNotFound,
          'Invalid Email or Password.'
        );
      }

      const isValidPassword = await bcrypt.compare(loginPostDto.password,user.password)
      
      if (!isValidPassword) {
        return this.BaseError.updateError(
          AuthErrorCodeEnum.ErrorAuthPasswordNotMatch,
          'Invalid Email or Password.'
        );
      }
      // Update the lastLogin time
      user.lastLogin = new Date();
      await user.save();

      const accessToken = await this.tokenProvider.createAccessToken({
        sub: user.id,
      });
      const refreshToken = await this.tokenProvider.createRefreshToken({
        sub: user.id,
      });
      this.logger.info(
        `Auth | User Login successfully with Email : ${loginPostDto.email}`
      );
      return AuthMapper.toDisplay({ accessToken, refreshToken }, user);
    } catch (error) {}
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    try {
      this.logger.info(
        `Auth | Start Executing Get Access Token By Refresh Token`
      );

      const payload = await this.tokenProvider.decryptRefreshToken(
        refreshToken.trim()
      );

      return {
        access_token: await this.tokenProvider.createAccessToken(payload),
        refresh_token: await this.tokenProvider.createRefreshToken(payload),
      };
    } catch (error) {
      return this.BaseError.updateError(
        AuthErrorCodeEnum.ErrorGetAccessToken,
        `There was an error in get accessToken by RefreshToken`,
        error
      );
    }
  }
}
