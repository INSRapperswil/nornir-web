import React, { useState, useEffect } from 'react';
import { getTasks, abortTask, getTaskDetails } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Collapse, IconButton, Paper, Tooltip, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField,
  Button, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogActions,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import RepeatIcon from '@material-ui/icons/Repeat';
import RefreshIcon from '@material-ui/icons/Refresh';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import { checkAndGetToken, setRerunTask } from '../redux/actions';
import { connect } from 'react-redux';
import TaskDetail from './TaskDetail';
import {
  beautifyDate, statusIdToText, newOrderName, SortableTableHead,
} from '../helperFunctions';
import FilterDialog from './FilterDialog';
import { useHistory } from 'react-router-dom';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { hasNetadminPermissions } from '../redux/reducers';
import { textToStatusId, statusToChip } from '../helperFunctions';

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
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginBottom: 5,
      marginRight: 10,
      marginTop: 5,
      marginLeft: 0,
    },
  },
  filters: {
    '& > *:last-child': {
      marginRight: 0,
    },
    justifyContent: 'flex-end',
  },
}));

function SelectStatus({ defaultValue }) {
  const selectList = [0, 1, 2, 3, 4, 5];
  return (
    <FormControl style={{ minWidth: '100%' }}>
      <InputLabel htmlFor="status">Status</InputLabel>
      <Select id="status" name="status" label="Status" defaultValue={defaultValue}>
        <MenuItem value=""><em>None</em></MenuItem>
        {selectList.map(item => <MenuItem value={item} key={item}>{statusIdToText(item)}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

function TasksTable({ checkAndGetToken, setRerunTask, onlyTemplates, hasPermission }) {
  let [tasks, setTasks] = useState([]);
  let [abortConfirmationOpen, setAbortConfirmationOpen] = useState(false);
  let [taskToAbort, setTaskToAbort] = useState({});
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(25);
  let [search, setSearch] = useState('');
  let [orderBy, setOrderBy] = useState('');
  let [isLoading, setIsLoading] = useState(true);
  const getDefaultFilters = () => {
    return [
      { label: 'Template Name', name: 'template__name', value: '' },
      { label: 'Inventory Name', name: 'inventory__name', value: '' },
      { label: 'Creator', name: 'created_by__username', value: '' },
      {
        label: 'Status', name: 'status', value: '',
        component: (defaultValue) => <SelectStatus defaultValue={defaultValue} />
      },
    ];
  };
  let [filters, setFilters] = useState(getDefaultFilters());
  const history = useHistory();

  const aggregateFilters = (filters) => {
    let f = Object.assign([], filters);
    f.push({ name: 'is_template', value: (onlyTemplates ? 'true' : 'false') });
    return f;
  };

  useEffect(() => {
    if (tasks.length === 0) {
      checkAndGetToken().then((token) => {
        getTasks(token, rowsPerPage, 0, aggregateFilters()).then((response) => {
          setTasks(response.results);
          setCount(response.count);
          setIsLoading(false);
        });
      })

    }
    // empty dependencies array, so it only runs on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  const fetchAndSetTasks = (page, pageSize, filters, search, order) => {
    const offset = page * pageSize;
    setIsLoading(true);
    checkAndGetToken().then((token) => {
      getTasks(token, pageSize, offset, aggregateFilters(filters), search, order).then((response) => {
        setTasks(response.results);
        setCount(response.count);
        setIsLoading(false);
      });
      setPage(page);
    }
    );
  };

  const handleSearch = (event) => {
    fetchAndSetTasks(0, rowsPerPage, filters, search, orderBy);
  };

  const handleFilterSubmit = (newFilters) => {
    setPage(0);
    setFilters(newFilters);
    fetchAndSetTasks(0, rowsPerPage, newFilters, search, orderBy);
  };

  const handleClearSearchFilter = (event) => {
    const newSearch = '';
    const newFilters = getDefaultFilters();
    setSearch(newSearch);
    setFilters(newFilters);
    fetchAndSetTasks(page, rowsPerPage, newFilters, newSearch, orderBy);
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

  const handleReRun = (e, task) => {
    checkAndGetToken().then((token) => {
      getTaskDetails(token, task.id).then((task) => {
        setRerunTask(task);
        history.push('/wizard?step=2')
      })
    })
  };

  const handleAbortConfirmation = (e, task) => {
    setTaskToAbort(task);
    setAbortConfirmationOpen(true);
  };
  const handleCancelAbort = (e) => {
    setTaskToAbort({});
    setAbortConfirmationOpen(false);
  };
  const handleAbortTask = (e) => {
    setAbortConfirmationOpen(false);
    checkAndGetToken().then((token) => {
      abortTask(token, taskToAbort.id).then((result) => {
        let updatedTasks = tasks.slice();
        const index = updatedTasks.findIndex((task) => task.id === result.id);
        updatedTasks[index] = result;
        setTasks(updatedTasks);
      });
    });
  }

  const headCells = [
    { label: '#', name: 'id', orderable: true },
    { label: 'Name', name: 'name', orderable: true },
    { label: 'Status', name: 'status', orderable: true },
    { label: 'Scheduled', name: 'date_scheduled', orderable: true, hiddenForTaskTemplates: true },
    { label: 'Started', name: 'date_started', orderable: true, hiddenForTaskTemplates: true },
    { label: 'Finished', name: 'date_finished', orderable: true, hiddenForTaskTemplates: true },
    { label: 'Creator', name: 'creator' },
    { label: 'Template', name: 'template' },
    { label: 'Abort Task', name: '', hiddenForTaskTemplates: true },
    { label: (onlyTemplates ? 'Run Task' : 'Rerun Task'), name: '' },
    { label: 'Detail View', name: '' },
  ];

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
          {/* <TableCell>{statusIdToText(row.status)}</TableCell> */}
          <TableCell>{statusToChip(row.status)}</TableCell>
          {
            onlyTemplates ? null :
              <React.Fragment>
                <TableCell>{beautifyDate(row.date_scheduled)}</TableCell>
                <TableCell>{beautifyDate(row.date_started)}</TableCell>
                <TableCell>{beautifyDate(row.date_finished)}</TableCell>
              </React.Fragment>
          }
          <TableCell>{row.created_name}</TableCell>
          <TableCell>{row.template_name}</TableCell>
          {
            !onlyTemplates ?
            <TableCell>
              {
                [textToStatusId("SCHEDULED")].includes(row.status) ?
                  <Tooltip title="Abort Task execution">
                    <IconButton onClick={(e) => handleAbortConfirmation(e, row)}>
                      <CancelIcon />
                    </IconButton>
                  </Tooltip> : null
              }
            </TableCell>
            : null
          }
          <TableCell>
            {
              onlyTemplates ?
                <Tooltip title="Run Task">
                  <IconButton onClick={(e) => handleReRun(e, row)} disabled={!hasPermission}>
                    <PlayCircleOutlineIcon color="primary" />
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title="Re-Run Task">
                  <IconButton onClick={(e) => handleReRun(e, row)} disabled={!hasPermission}>
                    <RepeatIcon />
                  </IconButton>
                </Tooltip>
            }
          </TableCell>
          <TableCell align="right">
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {
                open ? <Tooltip title="Close Details"><KeyboardArrowUpIcon /></Tooltip> :
                  <Tooltip title="Show Details"><KeyboardArrowDownIcon /></Tooltip>
              }
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow className={classes.detail}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headCells.length}>
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

  const handleSortChange = (event, name) => {
    const newName = newOrderName(orderBy, name);
    fetchAndSetTasks(page, rowsPerPage, filters, search, newName);
    setOrderBy(newName);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Grid container>
        <Grid item className={classes.box} xs={6}>
          <Button variant="contained" color="primary" onClick={onRefresh} disabled={isLoading}>
            <RefreshIcon /><span style={{ marginLeft: 3 }}>Refresh</span>
          </Button>
        </Grid>
        <Grid item className={`${classes.box} ${classes.filters}`} xs={6}>
          <Tooltip title="Clear Search and Filters">
            <Button variant="outlined" onClick={handleClearSearchFilter}>
              <HighlightOffIcon />
            </Button>
          </Tooltip>
          <FilterDialog filters={filters} setFilters={setFilters} onFilterSubmit={handleFilterSubmit} />
          <Button onClick={handleSearch} variant="outlined">Search</Button>
          <TextField
            label="Search Field"
            variant="outlined"
            value={search}
            onKeyPress={(e) => e.key === 'Enter' ? handleSearch(e) : null}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headCells.map((cell, index) => {
                if (onlyTemplates && cell.hiddenForTaskTemplates) {
                  return null;
                } else {
                  return <SortableTableHead key={index} cell={cell} orderBy={orderBy} onSortChange={handleSortChange} />
                }
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((value) => (
              <Row key={`${value.id}-${value.status}`} row={value} />
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
      <Dialog
        open={abortConfirmationOpen}
        onClose={handleCancelAbort}
      >
        <DialogTitle>Do you want to abort this task?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelAbort}>Cancel</Button>
          <Button onClick={handleAbortTask}>Abort</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    hasPermission: hasNetadminPermissions(state),
  };
};

const mapDispatchToProps = {
  checkAndGetToken,
  setRerunTask,
};

export default connect(mapStateToProps, mapDispatchToProps)(TasksTable);
