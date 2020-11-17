const backend = "http://localhost:8000";

function createFilterString(filters) {
  let filterString = '';
  for (let filter of filters) {
    if(filter.value) {
      filterString += `&${filter.name}=${filter.value}`;
    }
  }
  return filterString;
}

export function getTasks(token, limit=25, offset=0, filters=[], search='', ordering='') {
  return getAuthenticatedJson(`/api/tasks/?limit=${limit}&offset=${offset}&ordering=${ordering}&search=${search}${createFilterString(filters)}`, token)
          .then(parseJson);
}

export function getTaskDetails(token, taskId) {
  return getAuthenticatedJson(`/api/tasks/${taskId}/`, token).then(parseJson);
}

export function getJobTemplates(token, limit=25, offset=0, filters=[], search='', ordering='') {
  return getAuthenticatedJson(`/api/templates/?limit=${limit}&offset=${offset}&ordering=${ordering}&search=${search}${createFilterString(filters)}`, token).then(parseJson);
}

export function getJobTemplateDetails(token, jobTemplateId) {
  return getAuthenticatedJson(`/api/templates/${jobTemplateId}/`, token).then(parseJson);
}

export function getInventoryList(token) {
  return getAuthenticatedJson(`/api/inventories/`, token).then(parseJson);
}

export function getInventoryHosts(token, inventoryId, limit=25, offset=0, filters=[], search='', ordering='') {
  const url = `/api/inventories/${inventoryId}/hosts/?limit=${limit}&offset=${offset}&ordering=${ordering}&search=${search}${createFilterString(filters)}`;
  return getAuthenticatedJson(url, token).then(parseJson);
}

export function getHostDetails(token, inventoryId, friendly_name) {
  return getAuthenticatedJson(`/api/inventories/${inventoryId}/hosts/${friendly_name}/`, token).then(parseJson);
}

export function getTask(token, id) {
  return getAuthenticatedJson(`/api/tasks/${id}/`, token).then(parseJson);
}

export function postTask(token, task) {
  return postAuthenticatedJson('/api/tasks/', token, task).then(parseJson);
}

export function createTask(token, params) {
  return postAuthenticatedJson('/api/tasks/', token, params).then(parseJson);
}

export function runTask(token, id) {
  return postAuthenticatedJson(`/api/tasks/${id}/run/`, token).then(parseJson);
}

export function runTaskAsync(token, id) {
  return postAuthenticatedJson(`/api/tasks/${id}/run_async/`, token);
}

export function getConfiguration(token) {
  return getAuthenticatedJson(`/api/configuration/`, token).then(parseJson);
}

export function postConfiguration(token, configuration) {
  return postAuthenticatedJson(`/api/configuration/`, token, configuration).then(parseJson);
}

export function authenticate(username, password) {
  return postJson('/api/token/', { username, password }).then(parseJson);
}

export function getUser(id, token) {
  return getAuthenticatedJson(`/api/users/${id}/`, token).then(parseJson);
}

function getAuthenticatedJson(endpoint, token) {
  console.log(token);
  return fetch(`${backend}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  }).then(checkStatus);
}

function postAuthenticatedJson(endpoint, token, params) {
  return fetch(`${backend}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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
