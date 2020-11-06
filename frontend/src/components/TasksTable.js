import React, { useState, useEffect } from 'react';
import { getTasks } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Collapse, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import TaskDetail from './TaskDetail';
import { beautifyDate, statusIdToText } from '../helperFunctions';

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

  const useStyles = makeStyles(theme => ({
    table: {
      minWidth: 650,
    },
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    detail: {
      backgroundColor: theme.palette.action.hover,
    },
  }));

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
  
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell>{row.name}</TableCell>
          <TableCell>{statusIdToText(row.status)}</TableCell>
          <TableCell>{beautifyDate(row.date_scheduled)}</TableCell>
          <TableCell>{beautifyDate(row.date_started)}</TableCell>
          <TableCell>{beautifyDate(row.date_finished)}</TableCell>
          <TableCell>{row.created_by}</TableCell>
          <TableCell>{row.template}</TableCell>
          <TableCell align="right">
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow className={classes.detail}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <TaskDetail taskId={row.id} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

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
            <TableCell>Creator</TableCell>
            <TableCell>Template</TableCell>
            <TableCell align="right">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((value) => (
            <Row key={value.id} row={value} />
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
        component="div" />
    </TableContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(TasksTable);
