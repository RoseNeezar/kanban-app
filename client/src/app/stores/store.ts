import { createContext, useContext } from "react";
import KanbanStore from "./kanban.store";

interface Store {
  kanbanStore: KanbanStore;
}

export const store: Store = {
  kanbanStore: new KanbanStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
