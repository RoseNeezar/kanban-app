import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Board } from './board.model';
import { Cards } from './cards.model';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class List {
  @prop({ required: [true, 'Please tell use your name!'] })
  title: string;

  @prop({
    ref: 'Cards',
  })
  cardIds: Ref<Cards>[];

  @prop({
    ref: 'Board',
  })
  board: Ref<Board>;
}
