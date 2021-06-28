import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { List } from './list.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Cards {
  @prop({ required: [true, 'missing title!'] })
  title: string;

  @prop()
  descriptions: string;

  @prop({
    ref: 'List',
  })
  list: Ref<List>;
}
