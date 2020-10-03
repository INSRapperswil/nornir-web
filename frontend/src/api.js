const backend = "http://localhost";

export function getTasks(token) {
  return getAuthenticatedJson('/tasks').then(parseJson);
}

export function runTask(token, params) {
  return postAuthenticatedJson('/tasks', token, params).then(parseJson);
}

function getAuthenticatedJson(endpoint, token) {
  return fetch(`${backend}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json"
    }
  }).then(checkStatus);
}

function getJson(endpoint) {
  return fetch(`${backend}${endpoint}`, {
    method: "GET",
    Accept: "application/json"
  }).then(checkStatus);
}

function postAuthenticatedJson(endpoint, token, params) {
  return fetch(`${backend}${endpoint}`, {
    method: "POST",
    headers: {
<<<<<<< HEAD
      Authorization: `token ${token}`,
=======
      Authorization: `Bearer ${token}`,
>>>>>>> cee02227142589e6a74de9678a87ad632fdf000a
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(params)
  }).then(checkStatus);
}

function postJson(endpoint, params) {
  return fetch(`${backend}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(params)
  }).then(checkStatus);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJson(response) {
  return response.json();
}
