const backend = "http://localhost:8000";

export function getTasks(token) {
  return getAuthenticatedJson('/api/tasks/', token).then(parseJson);
}

export function getJobTemplates(token) {
  return getAuthenticatedJson('/api/templates/', token).then(parseJson);
}

export function getInventoryHosts(inventoryId, token) {
  return getAuthenticatedJson(`/api/inventories/${inventoryId}/hosts`, token).then(parseJson);
}

export function runTask(token, params) {
  return postAuthenticatedJson('/api/tasks/run/', token, params).then(parseJson);
}

export function authenticate(username, password) {
  return postJson('/api-token-auth/', { username, password }).then(parseJson)
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
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(params)
  }).then(checkStatus);
}

function postJson(endpoint, params) {
  return fetch(`${backend}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(params),
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
