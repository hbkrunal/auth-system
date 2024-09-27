import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './utils/logger/WinstonLogger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { swaggerLoader } from './utils/swagger';
import { env } from './env';


async function bootstrap() {
  const logger = new WinstonLogger();
  try {
    const app = await NestFactory.create(AppModule);

    // Cors
    app.enableCors();

    // Version
    app.enableVersioning({
      type: VersioningType.HEADER,
      header: 'Version',
    });

    // Global Validation
    app.useGlobalPipes(new ValidationPipe());

    //Swagger
    env.swagger.enabled && swaggerLoader(app);

    await app.listen(3000);

    logger.log(
      `Application is started: http://${env.app.host}:${env.app.port} -- Swagger IS Started: http://${env.app.host}:${env.app.port}${env.swagger.route}`,
      'bootstrap'
    );
  } catch (error) {
    logger.error(
      `Application is crashed: ${error.message}`,
      error.stack,
      'bootstrap'
    );
  }
}

bootstrap();
