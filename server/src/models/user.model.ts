import { modelOptions, pre, prop } from '@typegoose/typegoose';
import * as validator from 'validator';
import * as bcrypt from 'bcryptjs';

@pre<User>('save', async function () {
  this.password = await bcrypt.hash(this.password, 6);
})
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
    validate: {
      validator: validator.default.isEmail,
      message: 'Please provide a valid email',
    },
  })
  email: string;

  @prop({
    required: [true, 'Please tell use your password!'],
    select: false,
    minlength: 5,
  })
  password: string;
}
