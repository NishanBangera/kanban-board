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
    case "ADD_TASK": {
      const newTask = action.payload;
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }

    case "ADD_SECTION": {
      const { title, id } = action.payload;
      const newSection = {
        id,
        title,
      };

      return {
        ...state,
        sections: [...state.sections, newSection],
      };
    }
    case "UPDATE_SECTION": {
      const { id, title } = action.payload;
      const updatedSections = state.sections.map((section) => {
        if (section.id === id) return { id, title };
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
