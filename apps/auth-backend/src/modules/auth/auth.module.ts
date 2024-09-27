import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../../utils/logger/logger.module';
import { User, userSchema } from '../../database/models/user.model';
import { TokenProvider } from '../../utils/helpers/token.provider';
import { CryptoService } from '../../utils/helpers/crypto.provider';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    LoggerModule,
    MongooseModule.forFeature([{name:User.name,schema:userSchema}]),
  ],
  controllers: [AuthController],
  providers: [
    // Service
    AuthService,
    CryptoService,
    JwtService,
    // Other
    TokenProvider,
  ],
})
export class AuthModule {}
