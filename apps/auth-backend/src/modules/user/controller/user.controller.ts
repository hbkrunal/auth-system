import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { BaseController } from 'apps/auth-backend/src/core/environment/api/base-controller';
import { GetReqUser } from 'apps/auth-backend/src/utils/auth/decorators/getReqUser.decorator';
import { UserDisplayModel } from '../dto/user-display-model';

@ApiTags('User')
@ApiBearerAuth()
@Controller({ version: VERSION_NEUTRAL, path: '/api/user' })
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('/me')
  @ApiOkResponse({ type: UserDisplayModel })
  @ApiOperation({ summary: 'Get Current User' })
  async getUser(@GetReqUser() user: UserDisplayModel) {
    return await this.getResult(await this.userService.getUser(user._id));
  }
}
