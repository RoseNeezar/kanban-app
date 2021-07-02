export interface ITimer {
  long: number;
  active: string;
  short: number;
  work: number;
}

export type IActiveState = "work" | "long" | "short";
