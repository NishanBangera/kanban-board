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
      const { sections, tasks } = action.payload;

      return {
        ...state,
        sections,
        tasks,
      };
    }

    case "REORDER_TASK": {
      const reorderedTasks = action.payload;

      return {
        ...state,
        tasks: reorderedTasks,
      };
    }

    case "TEMP_ADD_TASK": {
      const task = action.payload as Task;
      return {
        ...state,
        tasks: [...state.tasks, task],
      };
    }

    case "ADD_TASK": {
      const { task, tasksOrder, tempCreateTaskId } = action.payload;
      const modifiedSections = state.sections.map((section) => {
        if (section.id === task.sectionId) {
          return { ...section, tasksOrder };
        }
        return section;
      });

      const modifiedTasks = state.tasks.map((item) => {
        if (item.id === tempCreateTaskId) {
          return task;
        }
        return item;
      });
      return {
        ...state,
        tasks: modifiedTasks,
        sections: modifiedSections,
      };
    }

    case "UPDATE_TASK": {
      const { id, title, tag, dueDate, user } = action.payload as Task;

      const modifiedTasks = state.tasks.map((item) => {
        if (id === item.id) {
          return { ...item, title, tag, dueDate, user };
        }
        return item;
      });

      return {
        ...state,
        tasks: modifiedTasks,
      };
    }

    case "DELETE_TASK": {
      const task = action.payload as Task;
      const modifySections = state.sections.map((section) => {
        if (section.id === task.sectionId) {
          return {
            ...section,
            tasksOrder: section.tasksOrder.filter((id) => id !== task.id),
          };
        }
        return section;
      });
      const filteredTasks = state.tasks.filter((item) => item.id !== task.id);

      return {
        ...state,
        sections: modifySections,
        tasks: filteredTasks,
      };
    }

    case "TEMP_ADD_SECTION": {
      const tempSection = action.payload;
      return {
        ...state,
        sections: [...state.sections, tempSection],
      };
    }

    case "ADD_SECTION": {
      const { tempSectionId, ...newSection } = action.payload;
      const modifiedSection = state.sections.map((section) => {
        if (section.id === tempSectionId) {
          return newSection;
        }
        return section;
      });
      return {
        ...state,
        sections: modifiedSection,
      };
    }
    case "UPDATE_SECTION": {
      const { title, sectionId } = action.payload;
      const updatedSections = state.sections.map((section) => {
        if (section.id === sectionId) return { ...section, sectionId, title };
        return section;
      });
      return {
        ...state,
        sections: updatedSections,
      };
    }

    case "DELETE_SECTION": {
      const sectionId = action.payload;
      const filteredSections = state.sections.filter(
        (section) => section.id !== sectionId
      );
      const filteredTasks = state.tasks.filter(
        (task) => task.sectionId !== sectionId
      );

      return {
        ...state,
        sections: filteredSections,
        tasks: filteredTasks,
      };
    }

    case "ROLLBACK_STATE": {
      const data = action.payload;
      return {
        ...state,
        ...data,
      };
    }

    default:
      return { ...state };
  }
};
