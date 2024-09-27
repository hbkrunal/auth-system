import { ModuleMetadata } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../errors/validation-error';
import { TokenProvider } from '../helpers/token.provider';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../helpers/crypto.provider';

export const AppModuleProviders: ModuleMetadata['providers'] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  TokenProvider,
  JwtService,
  CryptoService,
];
