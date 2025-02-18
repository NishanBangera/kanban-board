export const kanbanReducer = (state, action) => {
    switch (action.type) {
      case "ADD_SECTION": {
        const { title, id } = action.payload;
        const newSection = {
            id,
            title,
            taskIds: []
        }
  
        return {
          ...state,
          sections: [...state.sections, newSection]
      };
      }
    }
  };