export interface ITimer {
  long: number;
  active: IActiveState;
  short: number;
  work: number;
}

export type IActiveState = "work" | "long" | "short";
