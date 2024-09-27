import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from './core/environment/api/base-controller';

@ApiTags('Default')
@Controller('')
export class AppController extends BaseController {
  constructor() {
    super();
  }
  @Get('/')
  get() {
    return this.getResult('Server started successfully !');
  }
}
