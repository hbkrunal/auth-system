import { ISecretEnv } from './core/environment/interfaces/env-interface';

export const env: ISecretEnv = {
  db: {
    mongoURL: process.env.MONGO_URL,
  },
  app: {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT) || 3000,
  },
  swagger: {
    enabled: Boolean(process.env.SWAGGER_ENABLED),
    route: process.env.SWAGGER_ROUTE,
    username: process.env.SWAGGER_USERNAME,
    password: process.env.SWAGGER_PASSWORD,
  },
  // JWT secrets for user authentication
  jwtSecret: {
    accessTokenSecret: process.env.ACCESS_SECRET,
    refreshTokenSecret: process.env.REFRESH_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRE,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRE,
    cryptoSalt: process.env.CRYPTO_SALT,
  },
};
