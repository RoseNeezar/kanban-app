import create from "zustand";
import { combineAndImmer } from "./types/combineAndImmer";
import { ITimer } from "./types/pomodoro.types";

export const usePomodoroStore = create(
  combineAndImmer(
    {
      pomodoro: 0,
      timerEvents: {
        active: "work",
        long: 15,
        short: 1,
        work: 25,
      } as ITimer,
      timerState: false,
      timerEnd: false,
    },
    (set, get) => ({
      setStartTimer: (state: boolean) => {
        set((s) => {
          s.timerState = state;
        });
      },

      setTimerEnd: (state: boolean) => {
        set((s) => {
          s.timerEnd = state;
        });
      },

      startTimer: () => {
        set((s) => {
          s.timerState = true;
        });
      },

      pauseTimer: () => {
        set((s) => {
          s.timerState = false;
        });
      },

      resetTimer: () => {
        set((s) => {
          s.timerEvents = {
            active: "work",
            long: 15,
            short: 1,
            work: 25,
          };
        });
      },

      setTimerEvents: (evaluate: ITimer) => {
        switch (evaluate.active) {
          case "work":
            set((s) => {
              s.pomodoro = evaluate.work;
            });
            break;
          case "short":
            set((s) => {
              s.pomodoro = evaluate.short;
            });
            break;
          case "long":
            set((s) => {
              s.pomodoro = evaluate.long;
            });
            break;
          default:
            set((s) => {
              s.pomodoro = 0;
            });
            break;
        }
      },

      updateTimerEvents: (settings: ITimer) => {
        set((s) => {
          s.timerEvents = settings;
        });

        usePomodoroStore.getState().setTimerEvents(settings);
      },

      setCurrentTimer: (state: string) => {
        usePomodoroStore.getState().updateTimerEvents({
          ...get().timerEvents,
          active: state,
        });

        usePomodoroStore.getState().setTimerEvents(get().timerEvents);
      },
      stopTimer: () => {
        usePomodoroStore.getState().setTimerEnd(false);
        set((s) => {
          s.timerState = false;
        });
      },
    })
  )
);
