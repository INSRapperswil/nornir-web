import * as api from "../api";

export function fetchTasks() {
  return (dispatch, getState) => {
    dispatch({ type: "FETCH_TASKS_STARTED" });

    return api.getTasks()
    .then(({ result: tasks }) => {
      dispatch({ tasks: "FETCH_TASKS_SUCCEEDED", tasks })
    })
    .catch((error) => dispatch({ type: "FETCH_TASKS_FAILED", error }));
  };
}

