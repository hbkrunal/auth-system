export interface ISecretEnv {
  db: {
    mongoURL: string;
  };
  app: {
    host: string;
    port: number;
  };
  swagger: {
    enabled: boolean;
    route: string;
    username: string;
    password: string;
  };
  jwtSecret: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    cryptoSalt: string;
  };
}
