import { createParamDecorator } from '@nestjs/common';

export const GetReqUser = createParamDecorator((data, req) => {
  return req.args[0].user;
});
