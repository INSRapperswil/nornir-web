import * as api from "../api";
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
    let task = getState().taskWizard.task;
    
    task.template = task.template.id;
    task.inventory = inventoryId;
    if(!task.date_scheduled) {
      delete task.date_scheduled;
    }
    return api.postTask(getState().user.token, getState().taskWizard.task)
    .then((result) => {
      dispatch({ type: "POST_TASK_WIZARD_SUCCEEDED", lastCreatedTaskId: result.id })
      return result;
    })
    .catch((error) => dispatch({ type: "POST_TASK_WIZARD_FAILED", error }));
  };
}

export function updateTaskWizard(task) {
  return (dispatch, getState) => {
    dispatch({ type: "UPDATE_TASK_WIZARD", task: { ...getState().taskWizard.task, ...task }});
  };
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
    //TODO: access_token lost after page reload (maybe write to session storage)
    //TODO: Autoupdate access_token (lifetime of 5 minutes)
    return api.authenticate(username, password)
    .then((result) => {
      sessionStorage.setItem('refresh_token', result.refresh);
      let decoded = jwt_decode(result.refresh);
      let user = {
        'user_id': decoded.user_id,
        'refresh_token': result.refresh,
        'access_token': result.access,
        'username': decoded.username,
        'groups': decoded.groups,
      }
      dispatch({ type: "FETCH_USER_SUCCEEDED", user: { ...getState().user, ...user } });
    })
    .catch((error) => dispatch({ type: "FETCH_USER_FAILED", error }));
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch({ type: "LOGOUT" });
    sessionStorage.removeItem('refresh_token');
  };
}
