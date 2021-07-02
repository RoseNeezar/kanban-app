import { createContext, useContext } from "react";
import KanbanStore from "./kanban.store";
import UserStore from "./user.store";
import PomodoroStore from "./pomodoro.store";

interface Store {
  userStore: UserStore;
  kanbanStore: KanbanStore;
  pomodoroStore: PomodoroStore;
}

export const store: Store = {
  userStore: new UserStore(),
  kanbanStore: new KanbanStore(),
  pomodoroStore: new PomodoroStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
