import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from 'src/models/user.model';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): ReturnModelType<typeof User> => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
