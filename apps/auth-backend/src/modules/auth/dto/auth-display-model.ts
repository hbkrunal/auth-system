import { ApiProperty } from '@nestjs/swagger';

export class AuthDisplayModel {
  @ApiProperty()
  public access_token: string;

  @ApiProperty()
  public refresh_token?: string;

  @ApiProperty()
  public user?: any;
}
