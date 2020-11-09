import React, { useState, useEffect } from 'react';
import { getTasks } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Collapse, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField,
  Button, Select, MenuItem, InputLabel, FormControl,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import TaskDetail from './TaskDetail';
import { beautifyDate, statusIdToText } from '../helperFunctions';
import FilterDialog from './FilterDialog';

function SelectStatus() {
  const selectList = [0, 1, 2, 3, 4, 5];
  return (
    <FormControl style={{ minWidth: '100%' }}>
      <InputLabel htmlFor="status">Status</InputLabel>
      <Select id="status" name="status" label="Status" defaultValue="">
        <MenuItem value=""><em>None</em></MenuItem>
        { selectList.map(item => <MenuItem value={item} key={item}>{ statusIdToText(item) }</MenuItem>) }
      </Select>
    </FormControl>
  );
}

function TasksTable({ token }) {
  let [tasks, setTasks] = useState([]);
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(25);
  let [search, setSearch] = useState('');
  let [filters, setFilters] = useState([
    { label: 'Template Name', name: 'template__name', value: '' },
    { label: 'Inventory Name', name: 'inventory__name', value: '' },
    { label: 'Created By', name: 'created_by__username', value: '' },
    { label: 'Status', name: 'status', value: '', component: <SelectStatus/> },
  ]);

  useEffect(() => {
    if (tasks.length === 0) {
      getTasks(token, rowsPerPage, 0).then((response) => {
        setTasks(response.results);
        setCount(response.count);
      });
    }
  // empty dependencies array, so it only runs on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const fetchAndSetTasks = (page, pageSize, filters, search) => {
    const offset = page * pageSize;
    getTasks(token, pageSize, offset, filters, search).then((response) => {
      setTasks(response.results);
      setCount(response.count);
    });
    setPage(page);
  };

  const handleSearch = (event) => {
    fetchAndSetTasks(0, rowsPerPage, filters, search);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchAndSetTasks(0, rowsPerPage, newFilters, search);
  };

  const handleChangePage = (event, requestedPage) => {
    fetchAndSetTasks(requestedPage, rowsPerPage, filters, search);
  }

  const handleRowsPerPage = (event) => {
    const newPageSize = event.target.value;
    const newPage = parseInt(rowsPerPage * page / newPageSize);
    fetchAndSetTasks(newPage, newPageSize, filters, search);
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
    <React.Fragment>
      <Box style={{ marginBottom: 20 }}>
        <TextField
          label="Search Field"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
        <FilterDialog filters={filters} onFilterChange={handleFilterChange}/>
      </Box>
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
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(TasksTable);
