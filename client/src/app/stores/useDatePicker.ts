import create from "zustand";
import { combineAndImmer } from "./types/combineAndImmer";

interface MonthYear {
  month: number;
  year: number;
}

export const useDatePickerStore = create(
  combineAndImmer(
    {
      visible: null as MonthYear | null,
      date: new Date(),
      monthYear: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      } as MonthYear,
      isVisible: false,
    },
    (set, get) => ({
      setDate: (d: Date) => {
        set((s) => {
          (s.date = d),
            (s.visible = {
              month: d.getMonth(),
              year: d.getFullYear(),
            });
        });
      },
      setMonthYear: (date: MonthYear) => {
        set((s) => {
          s.monthYear = {
            month: date.month ?? get().date.getMonth(),
            year: date.year ?? get().date.getFullYear(),
          };
        });
      },
      setVisible: (visible: boolean) => {
        set((s) => {
          s.isVisible = visible;
        });
      },
      selectDate: (d: number) => {
        useDatePickerStore
          .getState()
          .setDate(new Date(get().monthYear.year, get().monthYear.month, d));
        useDatePickerStore.getState().setVisible(false);
      },
      isSelectedDate: (d: number): boolean => {
        if (
          d === get().date.getDate() &&
          get().monthYear.month === get().date.getMonth() &&
          get().monthYear.year === get().date.getFullYear()
        ) {
          return true;
        }
        return false;
      },
      nextMonth: () => {
        const result =
          get().monthYear.month >= 11
            ? { month: 0, year: get().monthYear.year + 1 }
            : { month: get().monthYear.month + 1, year: get().monthYear.year };

        set((s) => {
          (s.monthYear = result), (s.visible = result);
        });
      },
      prevMonth: () => {
        const result =
          get().monthYear.month <= 0
            ? { month: 11, year: get().monthYear.year - 1 }
            : { month: get().monthYear.month - 1, year: get().monthYear.year };
        set((s) => {
          (s.monthYear = result), (s.visible = result);
        });
      },
      showCalendar: () => {
        if (get().visible === null) {
          set((s) => {
            s.visible = {
              month: new Date().getMonth(),
              year: new Date().getFullYear(),
            };
          });
        }

        useDatePickerStore.getState().setVisible(true);
      },
      toggleCalendar: () =>
        useDatePickerStore.getState().setVisible(!get().isVisible),
    })
  )
);
