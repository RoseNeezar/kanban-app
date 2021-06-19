import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext): any => {
  const req = ctx.switchToHttp().getRequest();
  console.log(req.user);
  return req.user;
});
