import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Chip,
} from '@material-ui/core';
import jwt_decode from "jwt-decode";

const beautifulKeys = {
  "created_name": "Created By",
  "data": "Data",
  "date_finished": "Date Finished",
  "date_scheduled": "Date Scheduled",
  "date_started": "Date Started",
  "defaults_file": "Defaults File",
  "description": "Description",
  "file_name": "File Name",
  "filters": "Filters",
  "function_name": "Function Name",
  "groups_file": "Groups File",
  "groups": "Groups",
  "hostname": "Hostname",
  "hosts_file": "Hosts File",
  "id": "ID",
  "inventory_name": "Inventory",
  "name": "Name",
  "package_path": "Package Path",
  "platform": "Platform",
  "port": "Port",
  "status": "Status",
  "template_name": "Template",
  "type": "Type",
  "variables": "Variables",
}

export function beautifyDate(isoDate) {
  let date = new Date(isoDate);
  if (Date.parse(date) === 0) {
    return null;
  }
  return date.toLocaleString();
}

export function beautifyJson(jsonString) {
  let string = JSON.stringify(jsonString, null, 2);
  string = string.replace(/\\n/g, "\n");
  string = string.replace(/"/g, "");
  string = string.replace(/:/g, ": ");
  string = string.replace(/,/g, ", ");
  string = string.replace(/\[/g, "");
  string = string.replace(/\]/g, "");
  string = string.replace(/{/g, "");
  string = string.replace(/}/g, "");
  string = string.replace(/\\/g, "");
  string = string.replace(/\s+\n/g, "");
  string = string.replace(/ {2},/g, "");
  return string;
}

export function beautifyKey(key) {
  if (key in beautifulKeys) {
    return beautifulKeys[key];
  }
  return key;
}

export function buildUserState(refreshToken, accessToken) {
  let decodedRefreshToken = jwt_decode(refreshToken);
  let decodedAccessToken = jwt_decode(accessToken);
  let user = {
    'user_id': decodedRefreshToken.user_id,
    'refresh_token': refreshToken,
    'refresh_expiry': decodedRefreshToken.exp,
    'access_token': accessToken,
    'access_expiry': decodedAccessToken.exp,
    'username': decodedRefreshToken.username,
    'groups': decodedRefreshToken.groups,
  }
  return user;
}

export function objectToTable(data) {
  return (
    data === null || Object.keys(data).length === 0 ? null :
      Array.isArray(data) ?
        beautifyJson(data)
        :
        <Table size="small" aria-label="data">
          <TableHead>
            <TableRow>
              <TableCell>Attribute</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(data).map((key) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{beautifyJson(data[key])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  );
}


const statusArray =  ["CREATED", "SCHEDULED", "RUNNING", "FINISHED", "FAILED", "ABORTED"];
export function statusIdToText(statusId) {
  return statusArray[statusId];
}
export function textToStatusId(text) {
  return statusArray.indexOf(text);
}
function getStatusChip(color, label) {
  return <Chip style={{ backgroundColor: color }} label={label} />;
}
export function statusToChip(status) {
  switch (status) {
    case 3:
      return getStatusChip('rgb(237, 247, 237)', statusIdToText(status));
    case 4:
    case 5:
      return getStatusChip('rgb(253, 236, 234)', statusIdToText(status));
    default:
      return getStatusChip('rgb(232, 244, 253)', statusIdToText(status));
  }
}

export function isOrderActive(active, testOrder) {
  return testOrder === active || ('-' + testOrder) === active;
};

export function orderDirection(orderBy, name) {
  if (orderBy[0] === '-' && isOrderActive(orderBy, name)) {
    return 'desc';
  } else {
    return 'asc';
  }
};

export function newOrderName(orderBy, name) {
  let newName = '';
  if (isOrderActive(orderBy, name)) {
    const direction = orderDirection(orderBy, name);
    if (direction === 'asc') {
      newName = '-' + name;
    } else if (direction === 'desc') {
      newName = name.substring(0);
    } else {
      newName = name;
    }
  } else {
    newName = name;
  }
  return newName;
};

//accepts cell of format { label: '', name: '', orderable: true }
export function SortableTableHead({ cell, orderBy, onSortChange }) {
  return (
    cell.orderable ?
      <TableCell
        key={cell.name}
        sortDirection={orderDirection(orderBy, cell.name)}
        onClick={(e) => onSortChange(e, cell.name)}>
        <TableSortLabel active={isOrderActive(orderBy, cell.name)} direction={orderDirection(orderBy, cell.name)}>
          {cell.label}
        </TableSortLabel>
      </TableCell>
      :
      <TableCell key={cell.name}>{cell.label}</TableCell>
  );
}

export function getPaginationOptions() {
  return [2, 10, 25, 50];
}