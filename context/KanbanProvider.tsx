"use client";
import { KanbanContext } from "@/hooks/use-context";
import { kanbanReducer } from "@/reducer/kanban-reducer";
import { Section, StructuredSection, Task } from "@/types";
import { useCallback, useReducer } from "react";

const users = [
  {
    id: 1,
    name: "Emily Johnson",
    avatar: "https://dummyjson.com/icon/emilys/128",
  },
  {
    id: 2,
    name: "Michael Williams",
    avatar: "https://dummyjson.com/icon/michaelw/128",
  },
  {
    id: 3,
    name: "James Davis",
    avatar: "https://dummyjson.com/icon/jamesd/128",
  },
  {
    id: 4,
    name: "Emma Miller",
    avatar: "https://dummyjson.com/icon/emmaj/128",
  },
  {
    id: 5,
    name: "Alexander Jones",
    avatar: "https://dummyjson.com/icon/alexanderj/128",
  },
];

const KanbanProvider = ({
  data,
  children,
}: Readonly<{
  children: React.ReactNode;
  data: StructuredSection[];
}>) => {
  const tasks = data.map((section) => section.tasks);
  const sections = data.map(({ tasks, createdAt, updatedAt, ...rest }) => rest);
  const initialState = {
    sections,
    tasks: tasks.flat(),
    users,
  };
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  const addNewTask = useCallback((task: Task) => {
    dispatch({ type: "ADD_TASK", payload: task });
  }, []);

  const addNewSection = useCallback((section: Section) => {
    dispatch({ type: "ADD_SECTION", payload: section });
  }, []);

  const deleteSection = useCallback((id: string) => {
    dispatch({ type: "DELETE_SECTION", payload: id });
  }, []);

  const updateSection = useCallback((section: Section) => {
    dispatch({ type: "UPDATE_SECTION", payload: section });
  }, []);

  return (
    <KanbanContext.Provider
      value={{ ...state, addNewSection, deleteSection, updateSection, addNewTask }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export default KanbanProvider;
