import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ErrorInvalidUserToken } from '../errors/error-invalid-user-token';
import { AuthErrorCodeEnum } from '../errors/auth-error-code';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { WinstonLogger } from '../../logger/WinstonLogger';
import { TokenProvider } from '../../helpers/token.provider';
import { User } from 'apps/auth-backend/src/database/models/user.model';



@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: WinstonLogger,
    private readonly TokenProvider: TokenProvider,
    @InjectModel(User.name) private  userModel: Model<User>,
  ) {
    this.logger.setScope(__filename);
  }

  async use(req: any, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers?.authorization;
      // Verify presence of authorization header and valid format

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new ErrorInvalidUserToken();
      }

      // Extract JWT token from header
      const token = authorizationHeader.replace('Bearer', '').trim();

      // Decode and verify JWT token
      const payload = await this.TokenProvider.decryptAccessToken(token);

      const user = await this.userModel.findById(payload.sub).select('-password');
      if (!user) {
        throw new ErrorInvalidUserToken();
      }
      req.user =user 

      next();
      return;
    } catch (error) {
      this.logger.error(
        `Auth: Error in executing Auth middleware.\n Message: ${error}`,
        AuthErrorCodeEnum.errorUnauthorizedUser,
      );
      throw new UnauthorizedException(error.message || 'Unauthorized');
    }
  }
}
