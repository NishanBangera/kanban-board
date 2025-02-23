"use client";
import { KanbanContext } from "@/hooks/use-context";
import { getAllSections } from "@/lib/actions/section.action";
import { kanbanReducer } from "@/reducer/kanban-reducer";
import { Section, Task } from "@/types";
import { useCallback, useEffect, useReducer } from "react";

export const users = [
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
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const initialState = {
    sections: [] as Section[],
    tasks: [] as Task[],
    users,
  };
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  const tempAddNewTask = useCallback((data: { task: Task }) => {
    dispatch({ type: "TEMP_ADD_TASK", payload: data });
  }, []);

  const addNewTask = useCallback(
    (data: { task: Task; tasksOrder: string[] }, tempCreateTaskId: string) => {
      dispatch({ type: "ADD_TASK", payload: { ...data, tempCreateTaskId } });
    },
    []
  );

  const reorderTaskState = useCallback((tasks: Task[]) => {
    dispatch({ type: "REORDER_TASK", payload: tasks });
  }, []);

  const deleteTask = useCallback((task:Task) => {
    dispatch({ type: "DELETE_TASK", payload: task });
  }, []);

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: "UPDATE_TASK", payload: task });
  }, []);

  const tempAddNewSection = useCallback((section: Section) => {
    dispatch({ type: "TEMP_ADD_SECTION", payload: section });
  }, []);

  const addNewSection = useCallback((section: Section, tempSectionId: string) => {
    dispatch({ type: "ADD_SECTION", payload: {...section, tempSectionId} });
  }, []);

  const updateSection = useCallback((title: string, sectionId: string) => {
    dispatch({ type: "UPDATE_SECTION", payload: {title, sectionId} });
  }, []);

  const deleteSection = useCallback((id: string) => {
    dispatch({ type: "DELETE_SECTION", payload: id });
  }, []);

  const rollbackState = useCallback((data: {sections?: Section[], tasks: Task[]}) => {
    dispatch({ type: "ROLLBACK_STATE", payload: data });
  }, []);


  useEffect(() => {
    
    (async () => {
      const res = await getAllSections();
      const computedTasks = res
        .map((section) => {
          if (section.tasks.length > 0) {
            const taskMap = new Map(
              section.tasks.map((task) => [task.id, task])
            );
            const sortedTasks = section.tasksOrder.map((id) =>
              taskMap.get(id)
            ) as Task[];
            return sortedTasks;
          }
          return [];
        })
        .flat();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const computedSections = res.map(({ tasks, ...rest }) => rest);
      dispatch({
        type: "SET_INITIAL_DATA",
        payload: { sections: computedSections, tasks: computedTasks },
      });
    })();
  }, []);

  return (
    <KanbanContext.Provider
      value={{
        ...state,
        tempAddNewSection,
        addNewSection,
        updateSection,
        deleteSection,
        tempAddNewTask,
        addNewTask,
        deleteTask,
        updateTask,
        reorderTaskState,
        rollbackState
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export default KanbanProvider;
