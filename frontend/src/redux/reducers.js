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

const initialUser = {
  id: 0,
  token: '',
  username: '',
  groups: [],
  isLoading: false,
  error: null,
};

function initialUserFunction(state = initialUser) {
  const token = sessionStorage.getItem("token")
  if(token) {
    return { ...state, token: token };
  } else {
    return state;
  }
}
function user(state = initialUserFunction(), action) {
  switch (action.type) {
    case "FETCH_USER_STARTED":
      return { ...state, isLoading: true, error: null };
    case "FETCH_USER_SUCCEEDED":
      return { ...state, isLoading: false, ...action.user };
    case "FETCH_USER_FAILED":
      return { ...state, isLoading: false, error: action.error };
    case "LOGOUT":
      return { ...state, token: '' };
    default:
      return state;
  }
}

const initialTaskWizardState = {
  task: {
    name: '',
    date_scheduled: '',
    variables: {},
    filters: [],
    template: 1,
    inventory: 0,
  },
  isLoading: false,
  error: null,
};

function taskWizard(state = initialTaskWizardState, action) {
  switch (action.type) {
    case "POST_TASK_WIZARD_STARTED":
      return { ...state, isLoading: true, error: null };
    case "POST_TASK_WIZARD_SUCCEEDED":
      return { ...state, isLoading: false, task: action.task };
    case "UPDATE_TASK_WIZARD":
      return { ...state, isLoading: false, task: action.task };
    case "POST_TASK_WIZARD_FAILED":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

const reducers = combineReducers({
  tasks,
  user,
  taskWizard,
});

export default reducers;

export function getTasks(state) {
  return state.tasks.tasks;
}

export function getTaskWizard(state) {
  return state.taskWizard.task;
}

export function getToken(state) {
  return state.user.token;
}

export function getIsAuthenticated(state) {
  return state.user.token !== '';
}

export function getUser(state) {
  return state.user;
}
