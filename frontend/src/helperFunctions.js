import React from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel
} from '@material-ui/core';

export function beautifyDate(isoDate) {
  let date = new Date(isoDate);
  if (Date.parse(date) === 0) {
    return null;
  }
  return date.toLocaleString('de-DE');
}

export function beautifyJson(jsonString) {
  let string = JSON.stringify(jsonString);
  string = string.replace(/"/g, "");
  string = string.replace(/:/g, ": ");
  string = string.replace(/,/g, ", ");
  string = string.replace(/\[/g, "");
  string = string.replace(/\]/g, "");
  string = string.replace(/{/g, "");
  string = string.replace(/}/g, "\n");
  return string;
}

export function objectToTable(data) {
  return (
    data === null || Object.keys(data).length === 0 ? null :
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

export function statusIdToText(statusId) {
  switch (statusId) {
    case 0:
      return "CREATED";
    case 1:
      return "SCHEDULED";
    case 2:
      return "RUNNING";
    case 3:
      return "FINISHED";
    case 4:
      return "FAILED";
    case 5:
      return "ABORTED";
    default:
      break;
  }
}

export function isOrderActive (active, testOrder) {
  return testOrder === active || ('-' + testOrder) === active;
};

export function orderDirection (orderBy, name) {
  if (orderBy[0] === '-' && isOrderActive(orderBy, name)) {
    return 'desc';
  } else {
    return 'asc';
  }
};

export function  newOrderName (orderBy, name) {
  let newName = '';
  if(isOrderActive(orderBy, name)) {
    const direction = orderDirection(orderBy, name);
    if(direction === 'asc') {
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
        { cell.label }
      </TableSortLabel>
    </TableCell>
    :
    <TableCell key={cell.name}>{ cell.label }</TableCell>
  );
}
