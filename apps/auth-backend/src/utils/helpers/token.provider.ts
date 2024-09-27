import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CryptoService } from "./crypto.provider";
import { WinstonLogger } from "../logger/WinstonLogger";
import { ErrorInvalidUserToken } from "../auth/errors/error-invalid-user-token";
import { env } from "../../env";


type JwtPayload = {
  sub: string | number;
};

export interface ITokenProvider {
  createAccessToken(payload: JwtPayload): Promise<string>;
  createRefreshToken(payload: JwtPayload): Promise<string>;
}

@Injectable()
export class TokenProvider implements ITokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private cryptoService: CryptoService,
    private readonly logger?: WinstonLogger
  ) { }

  public async createAccessToken(payload: JwtPayload): Promise<string> {
    const encryptedSub = this.cryptoService.encrypt(
      payload.sub.toString()
    );

    const newPayload = JSON.stringify(encryptedSub);
    return this.jwtService.signAsync({ sub: newPayload }, {
      secret: env.jwtSecret.accessTokenSecret,
      expiresIn: env.jwtSecret.accessTokenExpiry
    });
  }

  public async createRefreshToken(payload: JwtPayload): Promise<string> {
    const encryptedSub = this.cryptoService.encrypt(
      payload.sub.toString()
    );
    const newPayload = JSON.stringify(encryptedSub);
    return this.jwtService.signAsync({ sub: newPayload }, {
      secret: env.jwtSecret.refreshTokenSecret
    });
  }

  public async decryptRefreshToken(refreshToken: string): Promise<JwtPayload> {

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: env.jwtSecret.refreshTokenSecret
    });

    if (!payload) {
      throw new ErrorInvalidUserToken();
    }

    const subPayload = JSON.parse(payload.sub)
    const refreshPayload = {
      sub: this.cryptoService.decrypt(subPayload)
    };
    return refreshPayload;
  }
  public async decryptAccessToken(accessToken: string): Promise<JwtPayload> {

    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: env.jwtSecret.accessTokenSecret
    });

    if (!payload) {
      throw new ErrorInvalidUserToken();
    }

    const subPayload = JSON.parse(payload.sub)

    const accessPayload = {
      sub: this.cryptoService.decrypt(subPayload)
    };

    return accessPayload;
  }



}
