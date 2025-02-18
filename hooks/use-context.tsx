import { createContext, useContext } from "react";

export const KanbanContext = createContext();

export const useKanbanContext = () => {
  return useContext(KanbanContext);
};
