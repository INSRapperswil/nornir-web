import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Button, Collapse, Dialog, DialogActions, DialogTitle,
  FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  Tooltip,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import RefreshIcon from '@material-ui/icons/Refresh';
import RepeatIcon from '@material-ui/icons/Repeat';

import { checkAndGetToken, setRerunTask } from '../redux/actions';
import { hasNetadminPermissions } from '../redux/reducers';
import { abortTask, getTasks, getTaskDetails } from '../api';
import TaskDetail from './TaskDetail';
import {
  beautifyDate, getPaginationOptions, newOrderName, SortableTableHead, statusIdToText, statusToChip, textToStatusId,
} from '../helperFunctions';
import FilterDialog from './FilterDialog';
import Search from './Search';

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

  const fetchAndSetTasks = ({ _page=page, _pageSize=rowsPerPage, _filters=filters, _search=search, _orderBy=orderBy }) => {
    const offset = _page * _pageSize;
    setIsLoading(true);
    checkAndGetToken().then((token) => {
      getTasks(token, _pageSize, offset, aggregateFilters(_filters), _search, _orderBy).then((response) => {
        setTasks(response.results);
        setCount(response.count);
        setIsLoading(false);
      });
      setPage(_page);
    }
    );
  };

  const handleSearch = (newSearch) => {
    setSearch(newSearch);
    fetchAndSetTasks({ _search: newSearch });
  };

  const handleFilterSubmit = (newFilters) => {
    setPage(0);
    setFilters(newFilters);
    fetchAndSetTasks({_page: 0, _filters: newFilters });
  };

  const handleClearSearchFilter = (event) => {
    const newSearch = '';
    const newFilters = getDefaultFilters();
    setSearch(newSearch);
    setFilters(newFilters);
    setPage(0);
    fetchAndSetTasks({ _page: 0, _filters:  newFilters, _search: newSearch });
  };

  const handleChangePage = (event, requestedPage) => {
    fetchAndSetTasks({ _page: requestedPage });
  }

  const handleRowsPerPage = (event) => {
    const newPageSize = event.target.value;
    const newPage = parseInt(rowsPerPage * page / newPageSize);
    fetchAndSetTasks({ _page: newPage, _pageSize: newPageSize });
    setRowsPerPage(newPageSize);
  };

  const onRefresh = (e) => {
    fetchAndSetTasks({});
  }

  const handleReRun = (e, task) => {
    checkAndGetToken().then((token) => {
      getTaskDetails(token, task.id).then((task) => {
        setRerunTask(task);
        history.push('/wizard?step=2');
      });
    });
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
  };

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
    fetchAndSetTasks({ _orderBy: newName });
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
          <Search onSearchSubmit={handleSearch} />
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
          rowsPerPageOptions={getPaginationOptions()}
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
