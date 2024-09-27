import {
  Body,
  Controller,
  HttpCode,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthDisplayModel } from '../dto/auth-display-model';
import { RegisterPostDto } from '../dto/register-post.dto';
import { LoginPostDto } from '../dto/login-post.dto';
import { BaseController } from 'apps/auth-backend/src/core/environment/api/base-controller';;
import { BaseError } from 'apps/auth-backend/src/utils/errors/base-error';
import { RefreshTokenDisplayModel, RefreshTokenDto } from '../dto/refreshToken.dto';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller({ version: VERSION_NEUTRAL, path: '/api/auth' })
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({ type: AuthDisplayModel })
  async register(
    @Body() register: RegisterPostDto
  ): Promise<AuthDisplayModel | BaseError> {
    return await this.getResult(await this.authService.registerUser(register));
  }

  @Post('/login')
  @ApiOperation({ summary: 'login user' })
  @ApiCreatedResponse({ type: AuthDisplayModel })
  async login(
    @Body() loginPostDto: LoginPostDto
  ): Promise<AuthDisplayModel | BaseError> {
    return this.getResult(await this.authService.login(loginPostDto));
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'get new token using refresh token' })
  @ApiCreatedResponse({ type: RefreshTokenDisplayModel })
  @HttpCode(200)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<RefreshTokenDisplayModel | BaseError> {
    return this.getResult(await this.authService.refreshToken(refreshTokenDto));
  }
}
