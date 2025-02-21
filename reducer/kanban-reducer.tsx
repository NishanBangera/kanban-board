import { Section, Task, User } from "@/types";

interface State {
  sections: Section[];
  tasks: Task[];
  users: User[];
}

interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export const kanbanReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_INITIAL_DATA": {
      const {sections, tasks} = action.payload

      return {
        ...state,
        sections,
        tasks
      }
    }

    case "REORDER_TASK": {
      const reorderedTasks = action.payload;

      return {
        ...state,
        tasks: reorderedTasks,
      };
    }

    case "ADD_TASK": {
      const { task, tasksOrder } = action.payload;
      const modifiedSections = state.sections.map((section) => {
        if (section.id === task.sectionId) {
          return { ...section, tasksOrder };
        }
        return section;
      }) as Section[];
      return {
        ...state,
        tasks: [...state.tasks, task],
        sections: modifiedSections,
      };
    }

    case "UPDATE_TASK": {
      const task = action.payload;
      const modifiedTasks = state.tasks.map((item) => {
        if (task.id === item.id) {
          return task;
        }
        return item;
      });

      return {
        ...state,
        tasks: modifiedTasks,
      };
    }

    case "DELETE_TASK": {
      const { id, data } = action.payload;
      const filteredTasks = state.tasks.filter((task) => task.id !== id);
      const modifiedSection = state.sections.map((section) => {
        if (section.id === data.id) return data;
        return section;
      });
      return {
        ...state,
        tasks: filteredTasks,
        sections: modifiedSection,
      };
    }

    case "ADD_SECTION": {
      const newSection = action.payload;

      return {
        ...state,
        sections: [...state.sections, newSection],
      };
    }
    case "UPDATE_SECTION": {
      const { id, title } = action.payload;
      const updatedSections = state.sections.map((section) => {
        if (section.id === id) return { ...section, id, title };
        return section;
      });
      return {
        ...state,
        sections: updatedSections,
      };
    }
    case "DELETE_SECTION": {
      const id = action.payload;
      const updatedSection = state.sections.filter(
        (section) => section.id !== id
      );
      const updatedTasks = state.tasks.filter(
        (task: Task) => task.sectionId !== id
      );
      return {
        ...state,
        sections: updatedSection,
        tasks: updatedTasks,
      };
    }
    default:
      return { ...state };
  }
};
