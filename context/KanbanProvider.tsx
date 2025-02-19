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
  const tasks = data.map((section) => {
    if (section.tasks.length > 0) {
      const taskMap = new Map(section.tasks.map((task) => [task.id, task]));
      const sortedTasks = section.tasksOrder.map((id) => taskMap.get(id)) as Task[]
      return sortedTasks;
    }
    return []
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sections = data.map(({ tasks, ...rest }) => rest);
  const initialState = {
    sections,
    tasks: tasks.flat(),
    users,
  };
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  const addNewTask = useCallback(
    (data: { task: Task; tasksOrder: string[] }) => {
      dispatch({ type: "ADD_TASK", payload: data });
    },
    []
  );

  const reorderTaskState = useCallback((tasks: Task[]) => {
    dispatch({ type: "REORDER_TASK", payload: tasks });
  }, []);

  const deleteTask = useCallback((id: string, data: undefined | Task[]) => {
    dispatch({ type: "DELETE_TASK", payload: { id, data } });
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
      value={{
        ...state,
        addNewSection,
        deleteSection,
        updateSection,
        addNewTask,
        deleteTask,
        reorderTaskState
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export default KanbanProvider;
