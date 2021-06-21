import { createContext, useContext } from "react";
import KanbanStore from "./kanban.store";
import UserStore from "./user.store";

interface Store {
  userStore: UserStore;
  kanbanStore: KanbanStore;
}

export const store: Store = {
  userStore: new UserStore(),
  kanbanStore: new KanbanStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
