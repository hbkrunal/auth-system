import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseError } from 'apps/auth-backend/src/utils/errors/base-error';
import { ErrorCategories } from 'apps/auth-backend/src/utils/errors/error-categories';
import { NotFoundWarnError } from 'apps/auth-backend/src/utils/errors/not-found-warn-error';
import { WinstonLogger } from 'apps/auth-backend/src/utils/logger/WinstonLogger';
import { NotFoundError } from 'rxjs';
import { BoolResult } from '../../dto/bool-result-dto';

export class BaseController {
  protected logger: WinstonLogger = new WinstonLogger();

  public getResult(response: any): any {
    if (response instanceof BaseError) {
      //Not Found Warn Error
      if (response instanceof NotFoundWarnError) {
        this.logger.warn(
          JSON.stringify(response),
          response.code,
          response.category
        );
        throw new NotFoundException(response);
      }

      //Not Found Error
      if (response instanceof NotFoundError) {
        this.logger.error(
          JSON.stringify(response),
          response.category,
          response.code
        );
        throw new NotFoundException(response);
      }

      //Unauthorized Error
      if (response.category === ErrorCategories.Unauthorized) {
        this.logger.error(
          JSON.stringify(response),
          response.category,
          response.code
        );
        throw new UnauthorizedException(response);
      }

      if (response.category === ErrorCategories.Forbidden) {
        this.logger.error(
          JSON.stringify(response),
          response.category,
          response.code
        );
        throw new ForbiddenException(response);
      }

      throw new BadRequestException(response);
    }
    if (typeof response === 'boolean') {
      return new BoolResult(response as boolean);
    }
    return response;
  }
}
