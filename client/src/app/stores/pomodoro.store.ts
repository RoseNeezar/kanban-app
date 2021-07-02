import { makeAutoObservable, runInAction } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { IActiveState, ITimer } from "./types/pomodoro.types";

enableStaticRendering(typeof window === "undefined");

export default class PomodoroStore {
  pomodoro = 0;
  executing: ITimer = {
    active: "work",
    long: 15,
    short: 10,
    work: 25,
  };
  startAnimate = false;

  constructor() {
    makeAutoObservable(this);
  }

  setStartAnimte = (state: boolean) => {
    this.startAnimate = state;
  };

  startTimer = () => {
    this.startAnimate = true;
  };

  pauseTimer = () => {
    this.startAnimate = false;
  };

  setCurrentTimer = (state: IActiveState) => {
    this.updateExecute({
      ...(this.executing as ITimer),
      active: state,
    });
    this.setTimerState(this.executing as ITimer);
  };

  updateExecute = (settings: ITimer) => {
    this.executing = settings;
    this.setTimerState(settings);
  };

  setTimerState = (evaluate: ITimer) => {
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

  stopAnimate = () => {
    this.startAnimate = false;
    alert("Done");
  };
}
