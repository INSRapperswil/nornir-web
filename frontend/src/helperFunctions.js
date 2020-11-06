import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

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