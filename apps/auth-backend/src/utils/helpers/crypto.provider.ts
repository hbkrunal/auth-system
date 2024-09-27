import { ErrorUnauthorizedUser } from '../auth/errors/error-unauthorized-user';
import { Injectable } from '@nestjs/common';

import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { env } from '../../env';
import { WinstonLogger } from '../logger/WinstonLogger';

@Injectable()
export class CryptoService {
  constructor(private readonly logger?: WinstonLogger) {}

  public encrypt(data: string) {
    try {
      const algorithm = 'aes-256-cbc';
      const iv = randomBytes(16);
      const cipher = createCipheriv(algorithm, env.jwtSecret.cryptoSalt, iv);
      const encryptedData =
        cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
      return {
        data: encryptedData,
        iv: iv.toString('hex'),
      };
    } catch (error) {
      this.logger.error(
        ` Auth: | Error in executing Encrypt payload with crypto.\n Message : ${error.message}`,
        error.stack
      );
      throw new ErrorUnauthorizedUser(error);
    }
  }

  public decrypt(encryptedData: { data: string; iv: string }) {
    try {
      const algorithm = 'aes-256-cbc';
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const decipher = createDecipheriv(
        algorithm,
        env.jwtSecret.cryptoSalt,
        iv
      );
      const decryptedData =
        decipher.update(encryptedData.data, 'base64', 'utf8') +
        decipher.final('utf8');
      return decryptedData;
    } catch (error) {
      this.logger.error(
        ` Auth: | Error in executing Decrypt payload with crypto.\n Message : ${error.message}`,
        error.stack
      );
      throw new ErrorUnauthorizedUser(error);
    }
  }
}
