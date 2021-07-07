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
import { auth } from "../utils/firebase";

axios.interceptors.request.use(async (config) => {
  let token = (await auth.currentUser?.getIdToken()) as string;
  if (token) {
    window.localStorage.removeItem("token");
    window.localStorage.setItem("token", token);
  }
  token = window.localStorage.getItem("token")!;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(undefined, (error) => {
  try {
    const { status, data } = error.response;

    if (status === 403) {
      if (
        data.message.includes("expired") ||
        data.message.includes("Missing Token")
      ) {
        auth.onAuthStateChanged((user) => {
          if (user) {
            user
              .getIdToken()
              .then(async (res) => {
                console.log("error--", res);
                window.localStorage.removeItem("token");
                localStorage.setItem("token", res);
                error.response.config.headers[
                  "Authorization"
                ] = `Bearer ${res}`;
                return axios(error.response.config);
              })
              .catch((err) => {
                window.location.replace(window.location.href);
                return Promise.reject(err);
              });
          }
        });
      }
    }
  } catch (error) {
    throw error.response;
  }
});

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
  login: (data: Pick<ILogin, "email">) =>
    requests.post<IUser>("auth/login", data),
  loginGoogle: (data: Pick<ILogin, "email">) =>
    requests.post<IUser>("auth/login/google", data),
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

  updateCard: (
    title: string,
    descriptions: string,
    cardId: string
  ): Promise<IUpdateCard> =>
    requests.post(`/cards/card/${cardId}`, { title, descriptions }),

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
    requests.del(`/boards/${boardId}`),
};

const agent = {
  AuthService,
  KanbanService,
};

export default agent;
