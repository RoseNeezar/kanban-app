import { makeAutoObservable, runInAction } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import agent from "../api/agent";
import {
  ICard,
  ICreateCard,
  IEditCard,
  IGetAllBoards,
  IGetAllListFromBoard,
  IKanbanList,
  IList,
} from "./types/kanban.types";

enableStaticRendering(typeof window === "undefined");

export default class KanbanStore {
  KanbanListItem: IKanbanList[] = [];
  openEditTodoModal: boolean = false;
  openProjectDescription: boolean = true;
  editCardID: IEditCard | null = null;
  allBoards: IGetAllBoards | null = null;
  currentBoardId: string = "";
  getAllList: IGetAllListFromBoard | null = null;
  listOrder: string[] = [];
  listInCurrentBoard: IList[] | null = null;
  AllCards: ICard[] | null = null;
  LoadingNotes = false;
  CardAdded: ICreateCard = {} as ICreateCard;

  constructor() {
    makeAutoObservable(this);
  }
  get GetCardText() {
    let temp = this.AllCards?.find(
      (res) => res._id === this.editCardID?.cardID
    );
    return temp;
  }

  setLoadingNotes = (load: boolean) => {
    this.LoadingNotes = load;
  };
  setOpenProjectDescription = (open: boolean) => {
    this.openProjectDescription = open;
  };
  setCardAdded = (cardIds: ICreateCard) => {
    this.CardAdded = cardIds;
  };
  setListOrder = (order: string[]) => {
    this.listOrder = order;
  };
  setListInCurrentBoard = (board: IList[] | null) => {
    this.listInCurrentBoard = board;
  };
  setAllCards = (card: ICard[]) => {
    this.AllCards = card;
  };
  setAllBoards = (board: IGetAllBoards | null) => {
    this.allBoards = board;
  };
  setCurrentBoardId = (id: string) => {
    this.currentBoardId = id;
  };
  setOpenEditTodoModal = (open: boolean) => {
    this.openEditTodoModal = open;
  };
  setGetAllList = (list: IGetAllListFromBoard) => {
    this.getAllList = list;
  };

  setEditCardID = (listID: string, cardID: string) => {
    let temp = {} as IEditCard;
    temp.cardID = cardID;
    temp.listID = listID;
    this.editCardID = temp;
  };

  setKanbanListItem = (item: IKanbanList[]) => {
    this.KanbanListItem = item;
  };

  deleteList = (listID: string, cardID: string) => {
    let result = this.KanbanListItem.find((res) => res.id === listID);
    let filter = result?.cards?.filter((res) => res.id !== cardID);
    this.KanbanListItem.forEach((res) => {
      if (res.id === listID) {
        res.cards = filter;
      }
    });
  };

  editList = (listID: string, cardID: string, text: string) => {
    this.KanbanListItem.forEach((res) => {
      if (res.id === listID) {
        res.cards?.forEach((re) => {
          if (re.id === cardID) {
            re.text = text;
          }
        });
      }
    });
  };

  sortKanban = (
    dropIdStart: string,
    dropIdEnd: string,
    dropIndexStart: number,
    dropIndexEnd: number,
    dragableID: string,
    type: string
  ) => {
    //drag list
    if (type === "list") {
      const list = this.listInCurrentBoard!.splice(dropIndexStart, 1);
      this.listInCurrentBoard?.splice(dropIndexEnd, 0, ...list);
      let result: string[] = [];

      this.listInCurrentBoard?.forEach((res) => result.push(res._id));
      this.ListReorder(this.currentBoardId, result);
    }
    //in same list
    if (dropIdStart === dropIdEnd) {
      const list = this.listInCurrentBoard?.find(
        (res) => dropIdStart === res._id
      );

      const card = list?.cardIds?.splice(dropIndexStart, 1);

      list?.cardIds?.splice(dropIndexEnd, 0, ...(card as []));
      if (list !== undefined) {
        this.CardReorderSameList(list!._id, list!.cardIds);
      }
    }
    //other list
    if (dropIdStart !== dropIdEnd) {
      //find list where drag happens
      const listStart = this.listInCurrentBoard?.find(
        (res) => dropIdStart === res._id
      );

      //pull out card from this list
      const card = listStart?.cardIds?.splice(dropIndexStart, 1);
      //find the list where drag ends
      const listEnd = this.listInCurrentBoard?.find(
        (res) => dropIdEnd === res._id
      );
      //put the card in new list
      listEnd?.cardIds?.splice(dropIndexEnd, 0, ...(card as []));

      this.CardReorderDiffList(
        listStart!._id,
        listEnd!._id,
        listStart!.cardIds,
        listEnd!.cardIds
      );
    }
  };
  CreateBoard = async (title: string) => {
    try {
      const result = await agent.KanbanService.createNewBoard(title);
      runInAction(() => {
        this.allBoards?.boards.push(result.result);
      });
    } catch (error) {}
  };

  CreateCard = async (listId: string, title: string) => {
    try {
      const result = await agent.KanbanService.createCard(listId, title);
      runInAction(() => {
        let temp = {} as ICard;
        temp._id = result.card._id;
        temp.title = result.card.title;
        if (this.AllCards === null) {
          this.setAllCards([temp]);
        } else {
          this.AllCards?.push(temp);
        }

        this.listInCurrentBoard?.forEach((res) => {
          if (res._id === result.card.list) {
            res.cardIds.push(result.card._id);
          }
        });
        this.setCardAdded(result);
      });
    } catch (error) {}
  };

  CreateList = async (title: string, boardId: string) => {
    try {
      const result = await agent.KanbanService.createNewList(title, boardId);
      runInAction(() => {
        this.listInCurrentBoard?.push(result.list);
      });
    } catch (error) {
      throw error;
    }
  };

  GetAllBoards = async () => {
    try {
      const result = await agent.KanbanService.getAllBoard();
      runInAction(() => {
        this.setAllBoards(result);
      });
    } catch (error) {
      throw error;
    }
  };
  GetList = async (boardId: string) => {
    try {
      this.setLoadingNotes(true);
      const result = await agent.KanbanService.getAllListFromBoard(boardId);
      runInAction(() => {
        this.setGetAllList(result);
        this.listOrder = result.board.listOrder;
        const order = result.list.sort((a, b) => {
          return (
            result.board.listOrder.indexOf(a._id as never) -
            result.board.listOrder.indexOf(b._id as never)
          );
        });
        this.setListInCurrentBoard(order);
        console.log(result.list);
        this.GetAllCard();
      });
    } catch (error) {
      throw error;
    }
  };

  GetAllCard = async () => {
    try {
      let temp = this.listOrder;
      if (this.listOrder.length === 0) {
        temp = [""];
      }
      const result = await agent.KanbanService.getAllCardFromList(temp);
      runInAction(() => {
        if (result.cards.length) this.setAllCards(result.cards.flat());
        this.setLoadingNotes(false);
      });
    } catch (error) {
      throw error;
    }
  };

  ListReorder = async (boardId: string, newListOrder: string[]) => {
    try {
      const result = await agent.KanbanService.updateListOrder(
        boardId,
        newListOrder
      );
      runInAction(() => {});
    } catch (error) {
      throw error;
    }
  };

  CardReorderSameList = async (
    sameListId: string,
    sameListCardIds: string[]
  ) => {
    try {
      const result = await agent.KanbanService.updateCardSameList(
        sameListId,
        sameListCardIds
      );
      runInAction(() => {});
    } catch (error) {
      throw error;
    }
  };

  CardReorderDiffList = async (
    removedListId: string,
    addedListId: string,
    removedListCardIds: string[],
    addedListCardIds: string[]
  ) => {
    try {
      const result = await agent.KanbanService.updateCardDifferentList(
        removedListId,
        addedListId,
        removedListCardIds,
        addedListCardIds
      );
      runInAction(() => {});
    } catch (error) {
      throw error;
    }
  };

  UpdateCard = async (title: string, descriptions: string, cardId: string) => {
    try {
      const result = await agent.KanbanService.updateCard(
        title,
        descriptions,
        cardId
      );
      runInAction(() => {
        let indexTodo = this.AllCards!.findIndex(
          (res) => res._id === result.data._id
        );
        if (this.AllCards !== null) {
          this.AllCards[indexTodo] = result.data;
        }
      });
    } catch (error) {
      throw error;
    }
  };
  DeleteCard = async (cardId: string) => {
    try {
      const result = await agent.KanbanService.deleteCard(cardId);
      runInAction(() => {
        let indexTodo = this.AllCards!.findIndex((res) => res._id === cardId);
        if (this.AllCards !== null) {
          this.AllCards!.splice(indexTodo, 1);
        }
      });
    } catch (error) {
      throw error;
    }
  };
  UpdateList = async (title: string, listId: string) => {
    try {
      const result = await agent.KanbanService.updateList(title, listId);
      runInAction(() => {
        if (this.listInCurrentBoard !== null) {
          let indexList = this.listInCurrentBoard.findIndex(
            (res) => res._id === result.data._id
          );
          this.listInCurrentBoard[indexList].title = result.data.title;
        }
      });
    } catch (error) {
      throw error;
    }
  };
  DeleteList = async (listId: string) => {
    try {
      const result = await agent.KanbanService.deleteList(listId);
      runInAction(() => {
        if (this.listInCurrentBoard !== null) {
          let indexList = this.listInCurrentBoard.findIndex(
            (res) => res._id === listId
          );
          this.listInCurrentBoard.splice(indexList, 1);
        }
      });
    } catch (error) {
      throw error;
    }
  };
  DeleteBoard = async (boardId: string) => {
    try {
      const result = await agent.KanbanService.deleteBoard(boardId);
      runInAction(() => {
        if (this.allBoards !== null) {
          let indexBoard = this.allBoards.boards.findIndex(
            (res) => res._id === boardId
          );
          this.allBoards.boards.splice(indexBoard, 1);
        }
      });
    } catch (error) {
      throw error;
    }
  };
}
