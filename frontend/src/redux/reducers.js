import { combineReducers } from "redux";
import { buildUserState } from "../helperFunctions";

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
  user_id: 0,
  refresh_token: '',
  refresh_expiry: '',
  access_token: '',
  access_expiry: '',
  username: '',
  groups: [],
  isLoading: false,
  error: null,
};

function initialUserFunction(state = initialUser) {
  const refresh_token = sessionStorage.getItem("refresh_token")
  const access_token = sessionStorage.getItem("access_token");
  if (refresh_token && access_token) {
    let user = buildUserState(refresh_token, access_token);
    return { ...state, ...user };
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
    case "REFRESH_TOKEN_STARTED":
      return { ...state, isLoading: true, error: null };
    case "REFRESH_TOKEN_SUCCEEDED":
      return { ...state, isLoading: false, ...action.user };
    case "REFRESH_TOKEN_FAILED":
      return { ...state, isLoading: false, error: action.error };
    case "LOGOUT":
      return { ...state, refresh_token: '' };
    default:
      return state;
  }
}

export const initialTaskWizardState = () => {
  return {
    task: {
      name: '',
      date_scheduled: '',
      variables: {},
      filters: { hosts: [] },
      template: { id: 0, },
      is_template: false,
    },
    lastCreatedTaskId: 0,
    isLoading: false,
    error: null,
  }
};

function taskWizard(state = initialTaskWizardState(), action) {
  switch (action.type) {
    case "POST_TASK_WIZARD_STARTED":
      return { ...state, isLoading: true, error: null };
    case "POST_TASK_WIZARD_SUCCEEDED":
      return { ...initialTaskWizardState(), lastCreatedTaskId: action.lastCreatedTaskId };
    case "UPDATE_TASK_WIZARD":
      return { ...state, isLoading: false, task: action.task };
    case "CLEAR_TASK_WIZARD":
      return initialTaskWizardState();
    case "POST_TASK_WIZARD_FAILED":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

const initialInventory = {
  inventory: 1,
  isLoading: false,
  error: null,
}

function inventorySelection(state = initialInventory, action) {
  switch (action.type) {
    case "UPDATE_INVENTORY_SELECTION":
      return { ...state, isLoading: false, inventory: action.inventory };
    default:
      return state;
  }
}

const reducers = combineReducers({
  inventorySelection,
  tasks,
  taskWizard,
  user,
});

export default reducers;

export function getTasks(state) {
  return state.tasks.tasks;
}

export function getWizardTask(state) {
  return state.taskWizard.task;
}

export function getWizard(state) {
  return state.taskWizard;
}

export function getInventorySelectionId(state) {
  return state.inventorySelection.inventory;
}

export function getIsAuthenticated(state) {
  return state.user.refresh_token !== '';
}

export function getUser(state) {
  return state.user;
}

export function hasSuperuserPermission(state) {
  return state.user.groups.includes('superuser');
}

export function hasNetadminPermissions(state) {
  return state.user.groups.includes('superuser') || state.user.groups.includes('netadmin');
}
