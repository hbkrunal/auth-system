import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppModuleImports } from './utils/app-module/app-module-imports';
import { DatabaseModule } from './database/database.module';
import { AppModuleProviders } from './utils/app-module/app-module-providers';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './utils/auth/middlewares/auth-middleware';

@Module({
  controllers: [AppController],
  imports: [...AppModuleImports, DatabaseModule,ConfigModule.forRoot()],
  providers: AppModuleProviders,
})
export class AppModule implements NestModule {
  excludeRoutes = [
    '/api/auth/login',
    '/api/auth/refresh',
    '/api/auth/register',
    '/'
  ];
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...this.excludeRoutes)
      .forRoutes('/api/*');
  }
}

