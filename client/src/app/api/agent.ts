import axios, { AxiosResponse } from "axios";
import {
  IGetAllBoards,
  ICreateBoard,
  ICreateList,
  IGetAllListFromBoard,
  IAllCards,
  ICreateCard,
  IUpdateCard,
  IUpdateList,
  IUpdateListOrder,
  IUpdateCardSameList,
} from "../stores/types/kanban.types";
import { ILogin, IRegister, IUser } from "../stores/types/user.types";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body?: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
  patch: (url: string, body: {}) => axios.patch(url, body).then(responseBody),
};

const AuthService = {
  login: (data: ILogin) => requests.post<IUser>("auth/login", data),
  register: (data: IRegister) => requests.post<void>("auth/register", data),
  logout: () => requests.post("auth/logout"),
  currentUser: () => requests.get<IUser>("auth/me"),
};

const KanbanService = {
  getAllBoard: (): Promise<IGetAllBoards> => requests.get("/boards/all"),

  createNewBoard: (title: string): Promise<ICreateBoard> =>
    requests.post("/boards", { title: title }),

  createNewList: (title: string, boardId: string): Promise<ICreateList> =>
    requests.post("/lists", {
      title: title,
      boardId: boardId,
    }),

  getAllListFromBoard: (boardId: string): Promise<IGetAllListFromBoard> =>
    requests.get(`/lists/all/${boardId}`),

  getAllCardFromList: (listIds: string[]): Promise<IAllCards> =>
    requests.post("/cards/getallcards", { listIds: listIds }),

  createCard: (listId: string, title: string): Promise<ICreateCard> =>
    requests.post("/cards", {
      listId: listId,
      title: title,
    }),

  updateCard: (title: string, cardId: string): Promise<IUpdateCard> =>
    requests.post(`/cards/card/${cardId}`, { title: title }),

  updateList: (title: string, listId: string): Promise<IUpdateList> =>
    requests.post(`/lists/${listId}`, { title: title }),

  updateListOrder: (
    boardId: string,
    newListOrder: string[]
  ): Promise<IUpdateListOrder> =>
    requests.patch("/boards", {
      boardId: boardId,
      newListOrder: newListOrder,
    }),

  updateCardSameList: (
    sameListId: string,
    sameListCardIds: string[]
  ): Promise<IUpdateCardSameList> =>
    requests.post("/cards/reorder/samelist", {
      sameListId: sameListId,
      sameListCardIds: sameListCardIds,
    }),

  updateCardDifferentList: (
    removedListId: string,
    addedListId: string,
    removedListCardIds: string[],
    addedListCardIds: string[]
  ): Promise<any> =>
    requests.post("/cards/reorder/differentlist", {
      removedListId: removedListId,
      addedListId: addedListId,
      removedListCardIds: removedListCardIds,
      addedListCardIds: addedListCardIds,
    }),
  deleteCard: (cardId: string): Promise<any> =>
    requests.del(`/cards/card/${cardId}`),
  deleteList: (listId: string): Promise<any> =>
    requests.del(`/lists/list/${listId}`),
  deleteBoard: (boardId: string): Promise<any> =>
    requests.del(`/boards/board/${boardId}`),
};

const agent = {
  AuthService,
  KanbanService,
};

export default agent;
