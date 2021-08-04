import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { List } from './list.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Board {
  @prop({ required: [true, 'missing title!'] })
  title: string;

  @prop({
    ref: 'List',
  })
  kanbanListOrder: Ref<List>[];

  @prop({
    ref: 'User',
  })
  user: Ref<User>;
}
