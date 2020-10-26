import * as api from "../api";

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

export function fetchUser() {
  return (dispatch, getState) => {
    dispatch({ type: "FETCH_USER_STARTED" });

    return api.getUser()
    .then(({ result: user }) => {
      dispatch({ type: "FETCH_USER_SUCCEEDED", user })
    })
    .catch((error) => dispatch({ type: "FETCH_USER_FAILED", error }));
  };
}

export function postTaskWizard() {
  return (dispatch, getState) => {
    dispatch({ type: "POST_TASK_WIZARD_STARTED" });

    let task = getState().taskWizard.task;
    task.template = task.template.id;
    if(!task.date_scheduled) {
      delete task.date_scheduled;
    }
    return api.postTask(getState().user.token, getState().taskWizard.task)
    .then(({ result: task }) => {
      dispatch({ type: "POST_TASK_WIZARD_SUCCEEDED", lastCreatedTaskId: task.id })
    })
    .catch((error) => dispatch({ type: "POST_TASK_WIZARD_FAILED", error }));
  };
}

export function updateTaskWizard(task) {
  return (dispatch, getState) => {
    dispatch({ type: "UPDATE_TASK_WIZARD", task: { ...getState().taskWizard.task, ...task }});
  };
}

export function authenticate(username, password) {
  return (dispatch, getState) => {
    dispatch({ type: "FETCH_USER_STARTED" });

    return api.authenticate(username, password)
    .then((result) => {
      sessionStorage.setItem('token', result.token);
      dispatch({ type: "FETCH_USER_SUCCEEDED", user: { ...getState().user, token: result.token } });
    })
    .catch((error) => dispatch({ type: "FETCH_USER_FAILED", error }));
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch({ type: "LOGOUT" });
    sessionStorage.removeItem('token');
  };
}
