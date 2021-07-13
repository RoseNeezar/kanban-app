import { modelOptions, prop } from '@typegoose/typegoose';
import * as validator from 'validator';
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class User {
  @prop({
    required: [true, 'Please tell use your name!'],
    unique: true,
    minlength: 5,
  })
  username: string;

  @prop({
    required: [true, 'Please tell use your email!'],
    unique: true,
    lowercase: true,
    index: true,
    validate: {
      validator: validator.default.isEmail,
      message: 'Please provide a valid email',
    },
  })
  email: string;
}
