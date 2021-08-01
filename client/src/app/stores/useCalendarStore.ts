import create from "zustand";
import { combineAndImmer } from "./types/combineAndImmer";
import { ICalendarCard } from "./types/kanban.types";

export const useCalendarStore = create(
  combineAndImmer(
    {
      cardDueDateList: undefined as ICalendarCard | undefined,
      openCardModal: false,
    },
    (set, get) => ({
      setCardDueDateList: (cardList: ICalendarCard) => {
        set((s) => {
          s.cardDueDateList = cardList;
        });
      },
      setOpenCardModal: (open: boolean) => {
        set((s) => {
          s.openCardModal = open;
        });
      },
    })
  )
);
