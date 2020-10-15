import React, { useState, useEffect } from 'react';
import { authenticate, getTasks } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function beautifyDate(isoDate) {
  let date = new Date(isoDate);
  if (Date.parse(date) === 0) {
    return null;
  }
  return date.toLocaleString('de-DE');

}

function TaskDashboard() {
  let [token, setToken] = useState('');
  let [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (token === '') {
      authenticate('norbert', 'netzwerk').then((response) => {
        if (tasks.length === 0) {
          getTasks(response.token).then((response) => setTasks(response));
        }
      });
    }
  }, [tasks, setTasks]);

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const classes = useStyles();

  return (
    <div id="tasks">
      <h1>Task Dashboard</h1>
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
      </TableContainer>

    </div>
  );
}

export default TaskDashboard;
