import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../../database/models/user.model';
import { CryptoService } from '../../utils/helpers/crypto.provider';
import { JwtService } from '@nestjs/jwt';
import { TokenProvider } from '../../utils/helpers/token.provider';
import { LoggerModule } from '../../utils/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    MongooseModule.forFeature([{name:User.name,schema:userSchema}]),
  ],
  controllers: [UserController],
  providers: [
    // Service
    UserService,
    CryptoService,
    JwtService,
    // Other
    TokenProvider,
  ],
  exports: [UserService],
})
export class UserModule {}
