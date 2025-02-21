"use client";

import { createContext, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const KanbanContext = createContext<null | any>(null);

export const useKanbanContext = () => {
  return useContext(KanbanContext);
};
