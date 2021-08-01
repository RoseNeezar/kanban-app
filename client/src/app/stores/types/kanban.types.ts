export interface IKanbanCard {
  id: string;
  text: string;
}

export interface IKanbanList {
  title: string;
  id: string;
  cards?: IKanbanCard[];
}

export interface IEditCard {
  listID: string;
  cardID: string;
}

export interface IGetAllBoards {
  boards: IBoard[];
}

export interface IBoard {
  kanbanListOrder: [];
  _id: string;
  title: string;
  user?: string;
  __v?: number;
}

export interface ICreateBoard {
  message: string;
  result: IBoard;
}

export interface IList {
  cardIds: string[];
  _id: string;
  board?: string;
  title: string;
  __v?: 0;
}

export interface ICreateList {
  message: string;
  list: IList;
}

export interface IGetAllListFromBoard {
  message: string;
  list: IList[];
  board: {
    kanbanListOrder: [];
    _id: string;
    title: string;
  };
}

export interface ICard {
  _id: string;
  title: string;
  dueDate?: Date;
  descriptions: string;
  list: string;
  boardId?: string;
}
export type ICalendarCard = Record<number, ICard[]>;

export interface IAllCards {
  message: string;
  cards: ICard[];
}

export interface ICreateCard {
  message: string;
  card: {
    _id: string;
    title: string;
    list: string;
    __v: 0;
  };
  list: IList;
}

export interface IUpdateCard {
  status: string;
  data: {
    _id: string;
    title: string;
    descriptions: string;
    list: string;
    cardId: string;
  };
}

export interface IUpdateList {
  message: string;
  data: IList;
}

export interface IListInBoard {
  details: {
    kanbanListOrder: [];
    _id: string;
    user: string;
    title: string;
    __v: number;
  };
}

export interface IUpdateListOrder {
  message: string;
  updatedListOrder: [];
}

export interface IUpdateCardSameList {
  message: string;
  savedList: IList;
}

export interface IFirstBoard {
  message: string;
  firstBoard: {
    kanbanListOrder: [];
    _id: string;
    user: string;
    title: string;
  };
}

export interface IUpdateCardDifferentList {
  message: string;
  removeLists: IList;
  addedLists: IList;
}
