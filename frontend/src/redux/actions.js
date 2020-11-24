import * as api from "../api";
import { buildUserState } from "../helperFunctions";
import jwt_decode from "jwt-decode";

export function fetchTasks() {
  return (dispatch, getState) => {
    dispatch({ type: "FETCH_TASKS_STARTED" });

    return api.getTasks()
      .then(({ result: tasks }) => {
        dispatch({ type: "FETCH_TASKS_SUCCEEDED", tasks })
      })
      .catch((error) => dispatch({ type: "FETCH_TASKS_FAILED", error }));
  };
}

export function postTaskWizard() {
  return (dispatch, getState) => {
    dispatch({ type: "POST_TASK_WIZARD_STARTED" });
    let inventoryId = getState().inventorySelection.inventory;
    let userId = getState().user.user_id;
    let task = getState().taskWizard.task;

    task.template = task.template.id;
    task.inventory = inventoryId;
    task.created_by = userId;
    if (!task.date_scheduled) {
      delete task.date_scheduled;
    }
    return dispatch(checkAndGetToken()).then((token) => {
      return api.postTask(token, getState().taskWizard.task)
        .then((result) => {
          dispatch({ type: "POST_TASK_WIZARD_SUCCEEDED", lastCreatedTaskId: result.id })
          return result;
        })
        .catch((error) => dispatch({ type: "POST_TASK_WIZARD_FAILED", error }));
    });
  };
}

export function updateTaskWizard(task) {
  return (dispatch, getState) => {
    dispatch({ type: "UPDATE_TASK_WIZARD", task: { ...getState().taskWizard.task, ...task } });
  };
}

export function clearTaskWizard() {
  return (dispatch, getState) => {
    dispatch({ type: "CLEAR_TASK_WIZARD" });
  }
}

function getRerunName(name) {
  const num = parseInt(name.replace(/(^\d+)(.+$)/i, '$1'));
  if (num) {
    return name.replace(/(^\d+)/i, (num + 1));
  }
  return '1. Rerun: ' + name;
}

export function setRerunTask(task) {
  return (dispatch, getState) => {
    dispatch({ type: "SET_RERUN_TASK" });
    let variables = task.variables;
    delete variables.name;
    variables = Object.entries(variables).map((entry) => { return { [entry[0]]: entry[1] }; });
    const newTask = {
      name: (task.is_template ? task.name : getRerunName(task.name)),
      date_scheduled: '',
      variables: variables,
      filters: task.filters,
      template: { id: task.template, name: task.template_name, variables: variables },
    };
    dispatch(updateTaskWizard(newTask));
  }
}

export function updateInventorySelection(inventory) {
  return (dispatch, getState) => {
    dispatch({ type: "UPDATE_INVENTORY_SELECTION", ...getState().inventorySelection, ...inventory });
  };
}

export function authenticate(username, password) {
  return (dispatch, getState) => {
    dispatch({ type: "FETCH_USER_STARTED" });
    return api.authenticate(username, password)
      .then((result) => {
        sessionStorage.setItem('refresh_token', result.refresh);
        sessionStorage.setItem('access_token', result.access);
        let user = buildUserState(result.refresh, result.access);
        dispatch({ type: "FETCH_USER_SUCCEEDED", user: { ...getState().user, ...user } });
      })
      .catch((error) => dispatch({ type: "FETCH_USER_FAILED", error }));
  };
}

export function checkAndGetToken() {
  return async (dispatch, getState) => {
    let token = getState().user.access_token;
    let decoded = jwt_decode(token);
    if (Date.now() > (decoded.exp * 1000)) {
      return await dispatch(renewAccessToken());
    }
    return token;
  };
}

export function renewAccessToken() {
  return (dispatch, getState) => {
    dispatch({ type: "REFRESH_TOKEN_STARTED" });
    let refreshToken = getState().user.refresh_token;
    return api.renewAccessToken(refreshToken)
      .then((result) => {
        let access_token = result.access;
        sessionStorage.setItem('access_token', access_token);
        let user = buildUserState(getState().user.refresh_token, access_token)
        dispatch({ type: "REFRESH_TOKEN_SUCCEEDED", user: { ...getState().user, ...user } });
        return access_token;
      })
      .catch((error) => dispatch({ type: "REFRESH_TOKEN_FAILED", error }));
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch({ type: "LOGOUT" });
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
  };
}
