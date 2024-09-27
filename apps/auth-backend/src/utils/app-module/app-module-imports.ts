import { ModuleMetadata } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { AuthModule } from '../../modules/auth/auth.module';
import { UserModule } from '../../modules/user/user.module';
import { WinstonLogger } from '../logger/WinstonLogger';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../../database/models/user.model';

export const AppModuleImports: ModuleMetadata['imports'] = [
  LoggerModule,  MongooseModule.forFeature([{name:User.name,schema:userSchema}]),
  AuthModule,
  UserModule,
];
