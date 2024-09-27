import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}

export class RefreshTokenDisplayModel {
  @ApiProperty()
  public access_token: string;

  @ApiProperty()
  public refresh_token: string;
}
