import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Box, Button, Collapse, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  Tooltip, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getJobTemplates } from '../api';
import { checkAndGetToken, updateTaskWizard, } from '../redux/actions';
import { getWizardTask } from '../redux/reducers';
import { getPaginationOptions, newOrderName, SortableTableHead, } from '../helperFunctions';
import JobTemplateDetail from './JobTemplateDetail';
import FilterDialog from './FilterDialog';
import Search from './Search';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 750,
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  radio: {
    padding: '0 0 0 16px',
    width: 48
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
    }
  },
  filters: {
    '& > *:last-child': {
      marginRight: 0,
    },
    justifyContent: 'flex-end',
  },
}));

function JobTemplatesSelectionTable({ checkAndGetToken, task, updateTaskWizard, setStepValid }) {
  let [templates, setTemplates] = useState([]);
  let [openRow, setOpenRow] = useState(-1);
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(25);
  let [search, setSearch] = useState('');
  let [orderBy, setOrderBy] = useState('');
  const getDefaultFilters = () => {
    return [
      { label: 'File Name', name: 'file_name', value: '' },
      { label: 'Function Name', name: 'function_name', value: '' },
      { label: 'Package Path', name: 'package_path', value: '' },
      { label: 'Creator', name: 'created_by__username', value: '' },
    ];
  };
  let [filters, setFilters] = useState(getDefaultFilters());

  const classes = useStyles();

  useEffect(() => {
    if (templates.length === 0) {
      checkAndGetToken().then((token) => {
        getJobTemplates(token, rowsPerPage, 0).then((response) => {
          setTemplates(response.results);
          setCount(response.count);
          setStepValid(task.template.id !== 0);
        })
      });
    }
    // empty dependencies array, so it only runs on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSelectionChange = (params) => {
    const newSelected = templates.find(item => parseInt(params.target.value) === item.id);
    setStepValid(newSelected.id !== 0);
    updateTaskWizard({ template: newSelected });
  }

  function Row(props) {
    const { row, setOpen, isOpen } = props;

    const handleOpen = (event) => {
      event.stopPropagation();
      isOpen ? setOpen(-1) : setOpen(row.id);
    }

    return (
      <React.Fragment>
        <TableRow
          hover
          onClick={() => handleSelectionChange({ target: { value: row.id } })}
          selected={row.id === task.template.id}
          key={row.id}
          className={classes.root}>
          <TableCell className={classes.radio}>
            <FormControlLabel value={row.id} control={<Radio />} />
          </TableCell>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.description}</TableCell>
          <TableCell>{row.created_name}</TableCell>
          <TableCell align="right">
            <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
              {
                isOpen ? <Tooltip title="Close Details"><KeyboardArrowUpIcon /></Tooltip> :
                  <Tooltip title="Show Details"><KeyboardArrowDownIcon /></Tooltip>
              }
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9} className={classes.detail}>
            <Collapse in={isOpen} timeout="auto" unmountOnExit style={{ paddingTop: 15, paddingBottom: 30 }}>
              <Box margin={1}>
                <Typography variant="h5" gutterBottom component="div">Details</Typography>
                <JobTemplateDetail jobTemplateId={row.id} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  const fetchAndSetTemplates = ({ _page=page, _pageSize=rowsPerPage, _filters=filters, _search=search, _orderBy=orderBy }) => {
    const offset = _page * _pageSize;
    checkAndGetToken().then((token) => {
      getJobTemplates(token, _pageSize, offset, _filters, _search, _orderBy).then((response) => {
        setTemplates(response.results);
        setCount(response.count);
      });
    });
  }

  const handleChangePage = (event, requestedPage) => {
    setPage(requestedPage);
    fetchAndSetTemplates({ _page: requestedPage });
  };

  const handleRowsPerPage = (event) => {
    const newPageSize = event.target.value;
    const newPage = parseInt(rowsPerPage * page / newPageSize);
    setPage(newPage);
    setRowsPerPage(newPageSize);
    fetchAndSetTemplates({ _page: newPage, _pageSize: newPageSize });
  };

  const handleFilterSubmit = (filters) => {
    setFilters(filters);
    setPage(0);
    fetchAndSetTemplates({ _page: 0, _filters: filters });
  }

  const handleSearch = (newSearch) => {
    setSearch(newSearch);
    fetchAndSetTemplates({ _page: 0, _search: newSearch });
  };

  const handleClearSearchFilter = (event) => {
    const newSearch = '';
    const newFilters = getDefaultFilters();
    setSearch(newSearch);
    setFilters(newFilters);
    setPage(0);
    fetchAndSetTemplates({ _page: 0, _filters: newFilters, _search: newSearch });
  };

  const headCells = [
    { label: '', name: '' },
    { label: '#', name: 'id', orderable: true },
    { label: 'Name', name: 'name', orderable: true },
    { label: 'Description', name: 'description', orderable: false },
    { label: 'Creator', name: 'created_by__username', orderable: true },
    { label: 'Detail View', name: '' },
  ];

  const handleSortChange = (event, name) => {
    const newName = newOrderName(orderBy, name);
    fetchAndSetTemplates({ _orderBy: newName });
    setOrderBy(newName);
  };

  return (
    <div id="job-templates-selection-table" style={{ marginBottom: 20, marginTop: 10 }}>
      <Grid container>
        <Grid item className={`${classes.box}`} xs={6}></Grid>
        <Grid item className={`${classes.box} ${classes.filters}`} xs={6}>
          <Tooltip title="Clear Search and Filters">
            <Button variant="outlined" onClick={handleClearSearchFilter}>
              <HighlightOffIcon />
            </Button>
          </Tooltip>
          <FilterDialog filters={filters} onFilterSubmit={handleFilterSubmit} />
          <Search onSearchSubmit={handleSearch} />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <RadioGroup name="template-id" value={task.template.id} onChange={handleSelectionChange}>
          <Table aria-label="templates table">
            <TableHead>
              <TableRow>
                {headCells.map((cell, index) => {
                  return <SortableTableHead cell={cell} key={index} orderBy={orderBy} onSortChange={handleSortChange} />
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((value) => (
                <Row row={value} key={value.id} isOpen={openRow === value.id} setOpen={setOpenRow} />
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
        </RadioGroup>
      </TableContainer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getWizardTask(state),
  };
};
const mapDispatchToProps = {
  checkAndGetToken,
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobTemplatesSelectionTable);
