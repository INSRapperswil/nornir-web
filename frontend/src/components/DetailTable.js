import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { beautifyDate, beautifyKey, objectToTable, statusIdToText } from '../helperFunctions';

function renderDesiredDetails(detailObject, key) {
  switch (key) {
    case "created_by":
    case "detail":
    case "inventory":
    case "result":
    case "template":
      return null;
    case "status":
      return (
        <TableRow key={key}>
          <TableCell component="th" scope="row">
            {beautifyKey(key)}
          </TableCell>
          <TableCell>
            {statusIdToText(detailObject[key])}
          </TableCell>
        </TableRow>
      );
    /* match for fields beginning with "date" */
    case String(key.match(/^date.*/)):
      return (
        <TableRow key={key}>
          <TableCell component="th" scope="row">
            {beautifyKey(key)}
          </TableCell>
          <TableCell>
            {beautifyDate(detailObject[key])}
          </TableCell>
        </TableRow>
      );
    default:
      return (
        <TableRow key={key}>
          <TableCell component="th" scope="row">
            {beautifyKey(key)}
          </TableCell>
          <TableCell>
            {typeof detailObject[key] === "object" ?
              objectToTable(detailObject[key])
              :
              detailObject[key]}
          </TableCell>
        </TableRow>
      );
  }
}

function DetailTable({ detailObject }) {

  const useStyles = makeStyles({
    root:
    {
      maxWidth: 800,
    },
  });

  const classes = useStyles();

  return (
    <Table size="small" aria-label="data" className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell>Attribute</TableCell>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(detailObject).map((key) => (
          renderDesiredDetails(detailObject, key)
        ))}
      </TableBody>
    </Table>
  )
}

export default DetailTable;