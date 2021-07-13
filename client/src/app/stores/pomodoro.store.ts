import { makeAutoObservable, toJS } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { ITimer } from "./types/pomodoro.types";

enableStaticRendering(typeof window === "undefined");

export default class PomodoroStore {
  pomodoro = 0;
  timerEvents: ITimer = {
    active: "work",
    long: 15,
    short: 1,
    work: 25,
  };
  timerState = false;
  timerEnd = false;

  constructor() {
    makeAutoObservable(this);
  }

  setStartTimer = (state: boolean) => {
    this.timerState = state;
  };

  setTimerEnd = (state: boolean) => {
    this.timerEnd = state;
  };

  startTimer = () => {
    this.timerState = true;
  };

  pauseTimer = () => {
    this.timerState = false;
  };

  resetTimer = () => {
    this.timerEvents = {
      active: "work",
      long: 15,
      short: 1,
      work: 25,
    };
  };

  setCurrentTimer = (state: string) => {
    this.updateTimerEvents({
      ...(this.timerEvents as ITimer),
      active: state,
    });
    this.setTimerEvents(this.timerEvents as ITimer);
  };

  updateTimerEvents = (settings: ITimer) => {
    this.timerEvents = settings;
    this.setTimerEvents(settings);
  };

  setTimerEvents = (evaluate: ITimer) => {
    switch (evaluate.active) {
      case "work":
        this.pomodoro = evaluate.work;
        break;
      case "short":
        this.pomodoro = evaluate.short;
        break;
      case "long":
        this.pomodoro = evaluate.long;
        break;
      default:
        this.pomodoro = 0;
        break;
    }
  };

  stopTimer = () => {
    this.setTimerEnd(false);
    this.timerState = false;
  };
}
