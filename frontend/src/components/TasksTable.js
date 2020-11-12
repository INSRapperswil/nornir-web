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
import RefreshIcon from '@material-ui/icons/Refresh';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import TaskDetail from './TaskDetail';
import {
  beautifyDate, statusIdToText, newOrderName, SortableTableHead,
} from '../helperFunctions';
import FilterDialog from './FilterDialog';

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
  box: {
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginBottom: 5,
      marginRight: 10,
      marginTop: 5,
      marginLeft: 0,
    },
  },
}));

function SelectStatus({ defaultValue }) {
  const selectList = [0, 1, 2, 3, 4, 5];
  return (
    <FormControl style={{ minWidth: '100%' }}>
      <InputLabel htmlFor="status">Status</InputLabel>
      <Select id="status" name="status" label="Status" defaultValue={defaultValue}>
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
  let [orderBy, setOrderBy] = useState('');
  let [filters, setFilters] = useState([
    { label: 'Template Name', name: 'template__name', value: '' },
    { label: 'Inventory Name', name: 'inventory__name', value: '' },
    { label: 'Created By', name: 'created_by__username', value: '' },
    { label: 'Status', name: 'status', value: '', component: (defaultValue) => <SelectStatus defaultValue={defaultValue}/> },
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

  const classes = useStyles();

  const fetchAndSetTasks = (page, pageSize, filters, search, order) => {
    const offset = page * pageSize;
    getTasks(token, pageSize, offset, filters, search, order).then((response) => {
      setTasks(response.results);
      setCount(response.count);
    });
    setPage(page);
  };

  const handleSearch = (event) => {
    fetchAndSetTasks(0, rowsPerPage, filters, search, orderBy);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchAndSetTasks(0, rowsPerPage, newFilters, search, orderBy);
  };

  const handleChangePage = (event, requestedPage) => {
    fetchAndSetTasks(requestedPage, rowsPerPage, filters, search, orderBy);
  }

  const handleRowsPerPage = (event) => {
    const newPageSize = event.target.value;
    const newPage = parseInt(rowsPerPage * page / newPageSize);
    fetchAndSetTasks(newPage, newPageSize, filters, search, orderBy);
    setRowsPerPage(newPageSize);
  };

  const onRefresh = (e) => {
    fetchAndSetTasks(page, rowsPerPage, filters, search, orderBy);
  }
  
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
            <Collapse in={open} timeout="auto" unmountOnExit style={{ paddingTop: 15, paddingBottom: 30 }}>
              <Box margin={1}>
                <TaskDetail taskId={row.id} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const headCells = [
    { label: '#', name: 'id', orderable: true },
    { label: 'Name', name: 'name', orderable: true },
    { label: 'Status', name: 'status', orderable: true },
    { label: 'Scheduled', name: 'date_scheduled', orderable: true },
    { label: 'Started', name: 'date_started', orderable: true },
    { label: 'Finished', name: 'date_finished', orderable: true },
    { label: 'Creator', name: 'creator' },
    { label: 'Template', name: 'template' },
    { label: '', name: '' },
  ];

  const handleSortChange = (event, name) => {
    const newName = newOrderName(orderBy, name);
    fetchAndSetTasks(page, rowsPerPage, filters, search, newName);
    setOrderBy(newName);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Box className={classes.box}>
        <TextField
          label="Search Field"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch} variant="outlined">Search</Button>
        <FilterDialog filters={filters} onFilterChange={handleFilterChange}/>
        <Button variant="contained" color="primary" onClick={onRefresh}>
          <RefreshIcon/><span style={{ marginLeft: 3 }}>Refresh</span>
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              { headCells.map((cell, index) => {
                return <SortableTableHead key={index} cell={cell} orderBy={orderBy} onSortChange={handleSortChange}/>
              })}
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
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(TasksTable);
