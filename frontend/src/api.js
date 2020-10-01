const backend = "http://localhost";

function getTasks() {
  return getJson('/tasks').then(parseJson);
}

function getAuthenticatedJson(endpoint, token) {
  return fetch(`${backend}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
      Authorization: `Bearer ${token}`,
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
