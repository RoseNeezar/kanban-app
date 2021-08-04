import create from "zustand";
import agent from "../api/agent";
import { combineAndImmer } from "./types/combineAndImmer";
import {
  ICard,
  ICreateBoard,
  ICreateCard,
  IEditCard,
  IGetAllBoards,
  IGetAllListFromBoard,
  IKanbanList,
  IList,
} from "./types/kanban.types";
import { cloneDeep } from "lodash";
import dayjs from "dayjs";

export const useKanbanStore = create(
  combineAndImmer(
    {
      currentKanbanBoardId: "",
      currentBoardTitle: "",
      kanbanBoards: null as IGetAllBoards | null,

      kanbanListItems: [] as IKanbanList[],
      getKanbanBoardLists: null as IGetAllListFromBoard | null,
      kanbanListOrder: [] as string[],
      kanbanListInCurrentBoard: null as IList[] | null,
      LoadingLists: false,

      openEditKanbanCardModal: false,
      currentKanbanCard: null as IEditCard | null,
      getKanbanBoardCards: null as ICard[] | null,
      CardAdded: {} as ICreateCard,
    },
    (set, get) => ({
      GetCardText: () => {
        let temp = get().getKanbanBoardCards?.find(
          (res) => res._id === get().currentKanbanCard?.cardID
        );
        return temp;
      },

      setLoadingLists: (load: boolean) => {
        set((s) => {
          s.LoadingLists = load;
        });
      },

      setListOrder: (order: string[]) => {
        set((s) => {
          s.kanbanListOrder = order;
        });
      },
      setListInCurrentBoard: (board: IList[] | null) => {
        set((s) => {
          s.kanbanListInCurrentBoard = board;
        });
      },
      setGetBoardContentCards: (card: ICard[]) => {
        set((s) => {
          s.getKanbanBoardCards = card;
        });
      },
      setAllBoards: (board: IGetAllBoards | null) => {
        set((s) => {
          s.kanbanBoards = board;
        });
      },
      setCurrentBoardId: (id: string) => {
        set((s) => {
          s.currentKanbanBoardId = id;
        });
      },

      setOpenEditTodoModal: (open: boolean) => {
        set((s) => {
          s.openEditKanbanCardModal = open;
        });
      },
      setGetBoardContentList: (list: IGetAllListFromBoard) => {
        set((s) => {
          s.getKanbanBoardLists = list;
        });
      },
      setKanbanListItem: (item: IKanbanList[]) => {
        set((s) => {
          s.kanbanListItems = item;
        });
      },
      setEditCardID: (listID: string, cardID: string) => {
        let temp = {} as IEditCard;
        temp.cardID = cardID;
        temp.listID = listID;
        set((s) => {
          s.currentKanbanCard = temp;
        });
      },

      deleteList: (listID: string, cardID: string) => {
        let result = get().kanbanListItems.find((res) => res.id === listID);
        let filter = result?.cards?.filter((res) => res.id !== cardID);
        set((s) => {
          s.kanbanListItems.forEach((res) => {
            if (res.id === listID) {
              res.cards = filter;
            }
          });
        });
      },

      editList: (listID: string, cardID: string, text: string) => {
        set((s) => {
          s.kanbanListItems.forEach((res) => {
            if (res.id === listID) {
              res.cards?.forEach((re) => {
                if (re.id === cardID) {
                  re.text = text;
                }
              });
            }
          });
        });
      },

      sortKanban: (
        dropIdStart: string,
        dropIdEnd: string,
        dropIndexStart: number,
        dropIndexEnd: number,
        dragableID: string,
        type: string
      ) => {
        //drag list
        if (type === "list") {
          set((s) => {
            const list: IList[] = s.kanbanListInCurrentBoard!.splice(
              dropIndexStart,
              1
            );
            s.kanbanListInCurrentBoard?.splice(dropIndexEnd, 0, ...list);
          });
          let result: string[] = [];
          get().kanbanListInCurrentBoard!.forEach((res) =>
            result.push(res._id)
          );
          useKanbanStore
            .getState()
            .ListReorder(get().currentKanbanBoardId, result);
        }
        //in same list
        if (dropIdStart === dropIdEnd) {
          set((s) => {
            const list = s.kanbanListInCurrentBoard!.find(
              (res) => dropIdStart === res._id
            );
            const card = list?.cardIds.splice(dropIndexStart, 1);
            list?.cardIds.splice(dropIndexEnd, 0, ...(card as []));
            if (list !== undefined) {
              useKanbanStore
                .getState()
                .CardReorderSameList(list!._id, list!.cardIds);
            }
          });
        }
        //other list
        if (dropIdStart !== dropIdEnd) {
          //find list where drag happens
          set((s) => {
            const listStart = s.kanbanListInCurrentBoard?.find(
              (res) => dropIdStart === res._id
            );

            //pull out card from this list
            const card = listStart?.cardIds?.splice(dropIndexStart, 1);
            //find the list where drag ends
            const listEnd = s.kanbanListInCurrentBoard?.find(
              (res) => dropIdEnd === res._id
            );
            //put the card in new list
            listEnd?.cardIds?.splice(dropIndexEnd, 0, ...(card as []));

            useKanbanStore
              .getState()
              .CardReorderDiffList(
                listStart!._id,
                listEnd!._id,
                listStart!.cardIds,
                listEnd!.cardIds
              );
          });
        }
      },
      CreateBoard: (result: ICreateBoard) => {
        set((s) => {
          s.kanbanBoards?.boards.push(result.result);
        });
      },

      CreateCard: async (listId: string, title: string) => {
        try {
          const result = await agent.KanbanService.createCard(listId, title);
          let temp = {} as ICard;
          temp._id = result.card._id;
          temp.title = result.card.title;
          if (get().getKanbanBoardCards === null) {
            useKanbanStore.getState().setGetBoardContentCards([temp]);
            set((s) => {
              s.kanbanListInCurrentBoard?.forEach((res) => {
                if (res._id === result.card.list) {
                  res.cardIds.push(result.card._id);
                }
              });
            });
          } else {
            set((s) => {
              s.getKanbanBoardCards?.push(temp),
                s.kanbanListInCurrentBoard?.forEach((res) => {
                  if (res._id === result.card.list) {
                    res.cardIds.push(result.card._id);
                  }
                });
            });
          }
          set((s) => {
            s.CardAdded = result;
          });
        } catch (error) {}
      },

      CreateList: async (title: string, boardId: string) => {
        try {
          const result = await agent.KanbanService.createNewList(
            title,
            boardId
          );
          set((s) => {
            s.kanbanListInCurrentBoard?.push(result.list);
          });
        } catch (error) {
          throw error;
        }
      },

      GetAllBoards: async () => {
        try {
          const result = await agent.KanbanService.getAllBoard();
          useKanbanStore.getState().setAllBoards(result);
        } catch (error) {
          throw error;
        }
      },
      GetBoardContent: async (boardId: string) => {
        try {
          useKanbanStore.getState().setLoadingLists(true);

          const result = await agent.KanbanService.getAllListFromBoard(boardId);
          useKanbanStore.getState().setGetBoardContentList(result);
          set((s) => {
            s.kanbanListOrder = result.board.kanbanListOrder;
          });
          let order = cloneDeep(result.list);
          order.sort((a, b) => {
            return (
              result.board.kanbanListOrder.indexOf(a._id as never) -
              result.board.kanbanListOrder.indexOf(b._id as never)
            );
          });
          useKanbanStore.getState().setListInCurrentBoard(order);
          useKanbanStore.getState().setCurrentBoardId(result.board._id);
          set((s) => {
            s.currentBoardTitle = result.board.title;
          });

          await useKanbanStore.getState().GetBoardCards();
        } catch (error) {
          throw error;
        }
      },

      GetBoardCards: async () => {
        try {
          let temp = get().kanbanListOrder;
          if (get().kanbanListOrder.length === 0) {
            temp = [""];
          }
          const result = await agent.KanbanService.getAllCardFromList(temp);

          if (result.cards.length)
            useKanbanStore
              .getState()
              .setGetBoardContentCards(result.cards.flat());
          useKanbanStore.getState().setLoadingLists(false);
        } catch (error) {
          throw error;
        }
      },

      ListReorder: async (boardId: string, newListOrder: string[]) => {
        try {
          await agent.KanbanService.updateListOrder(boardId, newListOrder);
        } catch (error) {
          throw error;
        }
      },

      CardReorderSameList: async (
        sameListId: string,
        sameListCardIds: string[]
      ) => {
        try {
          await agent.KanbanService.updateCardSameList(
            sameListId,
            sameListCardIds
          );
        } catch (error) {
          throw error;
        }
      },

      CardReorderDiffList: async (
        removedListId: string,
        addedListId: string,
        removedListCardIds: string[],
        addedListCardIds: string[]
      ) => {
        try {
          await agent.KanbanService.updateCardDifferentList(
            removedListId,
            addedListId,
            removedListCardIds,
            addedListCardIds
          );
        } catch (error) {
          throw error;
        }
      },

      UpdateCard: async (
        title: string,
        descriptions: string,
        cardId: string,
        dueDate?: Date
      ) => {
        try {
          const formatDate = !!dueDate
            ? dayjs(dueDate).format("YYYY-MM-DD HH:mm:ss")
            : undefined;
          const result = await agent.KanbanService.updateCard(
            title,
            descriptions,
            cardId,
            formatDate
          );
          let indexTodo = get().getKanbanBoardCards!.findIndex(
            (res) => res._id === result.data._id
          );
          if (get().getKanbanBoardCards !== null) {
            set((s) => {
              s.getKanbanBoardCards![indexTodo] = result.data;
            });
          }
        } catch (error) {
          throw error;
        }
      },
      DeleteCard: async (cardId: string) => {
        try {
          await agent.KanbanService.deleteCard(cardId);
          let indexTodo = get().getKanbanBoardCards!.findIndex(
            (res) => res._id === cardId
          );
          if (get().getKanbanBoardCards !== null) {
            set((s) => {
              s.getKanbanBoardCards!.splice(indexTodo, 1);
            });
          }
        } catch (error) {
          throw error;
        }
      },
      UpdateList: async (title: string, listId: string) => {
        try {
          const result = await agent.KanbanService.updateList(title, listId);

          if (get().kanbanListInCurrentBoard !== null) {
            let indexList = get().kanbanListInCurrentBoard!.findIndex(
              (res) => res._id === result.data._id
            );
            set((s) => {
              s.kanbanListInCurrentBoard![indexList].title = result.data.title;
            });
          }
        } catch (error) {
          throw error;
        }
      },
      DeleteList: async (listId: string) => {
        try {
          await agent.KanbanService.deleteList(listId);

          if (get().kanbanListInCurrentBoard !== null) {
            let indexList = get().kanbanListInCurrentBoard!.findIndex(
              (res) => res._id === listId
            );
            set((s) => {
              s.kanbanListInCurrentBoard!.splice(indexList, 1);
            });
          }
        } catch (error) {
          throw error;
        }
      },
      DeleteBoard: async (boardId: string) => {
        try {
          await agent.KanbanService.deleteBoard(boardId);

          if (get().kanbanBoards !== null) {
            let indexBoard = get().kanbanBoards!.boards.findIndex(
              (res) => res._id === boardId
            );
            set((s) => {
              s.kanbanBoards!.boards.splice(indexBoard, 1);
            });
          }
        } catch (error) {
          throw error;
        }
      },
    })
  )
);
