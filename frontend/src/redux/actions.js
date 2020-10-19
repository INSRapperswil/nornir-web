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
