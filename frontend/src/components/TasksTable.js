import React, { useState, useEffect } from 'react';
import { getTasks } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination,
  Paper,
} from '@material-ui/core';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';

function beautifyDate(isoDate) {
  let date = new Date(isoDate);
  if (Date.parse(date) === 0) {
    return null;
  }
  return date.toLocaleString('de-DE');

}

function TasksTable({ token }) {
  let [tasks, setTasks] = useState([]);
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    if (tasks.length === 0) {
      getTasks(token, rowsPerPage, 0).then((response) => {
        setTasks(response.results);
        setCount(response.count);
      });
    }
  }, [tasks, setTasks, token, rowsPerPage]);

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();

  const handleChangePage = (event, requestedPage) => {
    const offset = requestedPage * rowsPerPage;
    getTasks(token, rowsPerPage, offset).then((response) => {
      setTasks(response.results);
      setCount(response.count);
    })
    setPage(requestedPage);
  }

  const handleRowsPerPage = (event) => {
    const newPageSize = event.target.value;
    const newPage = parseInt(rowsPerPage * page / newPageSize);
    const offset = newPageSize * newPage;
    getTasks(token, newPageSize, offset).then((response) => {
      setTasks(response.results);
      setCount(response.count);
    })
    setPage(newPage);
    setRowsPerPage(newPageSize);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Scheduled</TableCell>
            <TableCell>Started</TableCell>
            <TableCell>Finished</TableCell>
            <TableCell>Parameters</TableCell>
            <TableCell>Filters</TableCell>
            <TableCell>Input</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Creator</TableCell>
            <TableCell>Template</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((value, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {value.id}
              </TableCell>
              <TableCell>{value.name}</TableCell>
              <TableCell>{value.status}</TableCell>
              <TableCell>{beautifyDate(value.date_scheduled)}</TableCell>
              <TableCell>{beautifyDate(value.date_started)}</TableCell>
              <TableCell>{beautifyDate(value.date_finished)}</TableCell>
              <TableCell>{JSON.stringify(value.variables)}</TableCell>
              <TableCell>{JSON.stringify(value.filters)}</TableCell>
              <TableCell>{JSON.stringify(value.result_host_selection)}</TableCell>
              <TableCell>{JSON.stringify(value.result)}</TableCell>
              <TableCell>{value.created_by}</TableCell>
              <TableCell>{value.template}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[2, 10, 25, 50]}
        rowsPerPage={rowsPerPage}
        page={page}
        count={count}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleRowsPerPage}
        component="div"/>
    </TableContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(TasksTable);
