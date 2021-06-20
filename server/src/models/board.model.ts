import { modelOptions, mongoose, prop, Ref } from '@typegoose/typegoose';
import { List } from './list.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Board {
  @prop({ required: [true, 'Please tell use your name!'] })
  title: string;

  @prop({
    ref: 'List',
  })
  listOrder: Ref<List>[];

  @prop({
    ref: 'User',
  })
  user: Ref<User>;
}
