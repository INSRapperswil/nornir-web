import { combineReducers } from "redux";

const initialTasksState = {
  tasks: null,
  isLoading: false,
  error: null,
};

function tasks(state = initialTasksState, action) {
  switch (action.type) {
    case "FETCH_TASKS_STARTED":
      return { ...state, isLoading: true, error: null };
    case "FETCH_TASKS_SUCCEEDED":
      return { ...state, isLoading: false, tasks: action.tasks };
    case "FETCH_TASKS_FAILED":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

const reducers = combineReducers({
  tasks,
});

export default reducers;

export function getTasks(state) {
  return state.tasks.tasks;
}
