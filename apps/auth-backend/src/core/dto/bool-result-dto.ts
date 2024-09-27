import { ApiProperty } from '@nestjs/swagger';

export class BoolResult {
  @ApiProperty({ example: true })
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }
}
