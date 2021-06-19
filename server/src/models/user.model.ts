import { modelOptions, prop } from '@typegoose/typegoose';
import * as validator from 'validator';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class User {
  @prop({ required: [true, 'Please tell use your name!'] })
  username: string;

  @prop({
    required: [true, 'Please tell use your email!'],
    unique: true,
    validate: [validator.default.isEmail],
  })
  email: string;

  @prop({ required: [true, 'Please tell use your password!'], select: false })
  password: string;
}
