import { Types } from 'mongoose';

interface ICards {
  title: string;
  listId: Types.ObjectId;
  cardId: Types.ObjectId;
  sameListId: Types.ObjectId;
  sameListCardIds: string[];
  removedListId: Types.ObjectId;
  addedListId: Types.ObjectId;
  removedListCardIds: string[];
  addedListCardIds: string[];
  listIds: string[];
  descriptions: string;
  dueDate: Date;
}

export type ICreateCard = Pick<ICards, 'listId' | 'title'>;
export type IGetAllCards = Pick<ICards, 'listIds'>;
export type IUpdateCard = Pick<ICards, 'title' | 'descriptions' | 'dueDate'>;
export type IUpdateCardSameList = Pick<
  ICards,
  'sameListId' | 'sameListCardIds'
>;
export type IUpdateCardDifferentList = Pick<
  ICards,
  'removedListId' | 'addedListId' | 'removedListCardIds' | 'addedListCardIds'
>;
export type IDeleteCard = Pick<ICards, 'cardId'>;
