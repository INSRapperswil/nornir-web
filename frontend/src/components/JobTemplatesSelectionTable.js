import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateTaskWizard } from '../redux/actions';
import { getWizardTask, getToken } from '../redux/reducers';
import { getJobTemplates } from '../api';
import {
  RadioGroup, Radio,
  Table, TableHead, TableBody, TableContainer, TableRow, TableCell, TablePagination,
  Paper, Box, Typography, Collapse, IconButton, FormControlLabel,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';
import JobTemplateDetail from './JobTemplateDetail';
import FilterDialog from './FilterDialog';

function JobTemplatesSelectionTable({ token, task, updateTaskWizard, setStepValid }) {
  let [templates, setTemplates] = useState([]);
  let [openRow, setOpenRow] = useState(-1);
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(25);
  let [filters, setFilters] = useState([
    { label: 'File Name', name: 'file_name', value: '' },
    { label: 'Function Name', name: 'function_name', value: '' },
    { label: 'Package Path', name: 'package_path', value: '' },
    { label: 'Created By', name: 'created_by__username', value: '' },
  ]);

  useEffect(() => {
    if (templates.length === 0) {
      getJobTemplates(token, rowsPerPage, 0).then((response) => {
        setTemplates(response.results);
        setCount(response.count);
        setStepValid(task.template.id !== 0);
      });
    }
  }, [templates, setTemplates, setStepValid, task, token, rowsPerPage]);


  const handleSelectionChange = (params) => {
    const newSelected = templates.find(item => parseInt(params.target.value) === item.id);
    setStepValid(newSelected.id !== 0);
    updateTaskWizard({ template: newSelected });
  }

  const useStyles = makeStyles(theme => ({
    table: {
      minWidth: 650,
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
  }));


  function Row(props) {
    const { row, setOpen, isOpen } = props;
    const classes = useStyles();

    const handleOpen = (event) => {
      event.stopPropagation();
      isOpen ? setOpen(-1) : setOpen(row.id);
    }

    return (
      <React.Fragment>
        <TableRow
          hover
          onClick={(event) => handleSelectionChange({ target: { value: row.id } })}
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
          <TableCell>{row.created_by}</TableCell>
          <TableCell align="right">
            <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9} className={classes.detail}>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">Details</Typography>
                <JobTemplateDetail jobTemplateId={row.id} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  const fetchAndSetTemplates = (page, pageSize, filters) => {
    const offset = page * pageSize;
    getJobTemplates(token, pageSize, offset, filters).then((response) => {
      setTemplates(response.results);
      setCount(response.count);
    });
  }

  const handleChangePage = (event, requestedPage) => {
    setPage(requestedPage);
    fetchAndSetTemplates(requestedPage, rowsPerPage, filters);
  };

  const handleRowsPerPage = (event) => {
    const newPageSize = event.target.value;
    const newPage = parseInt(rowsPerPage * page / newPageSize);
    setPage(newPage);
    setRowsPerPage(newPageSize);
    fetchAndSetTemplates(newPage, newPageSize, filters);
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
    setPage(0)
    fetchAndSetTemplates(page, rowsPerPage, filters);
  }

  return (
    <div id="job-templates-selection-table">
      <Box style={{ marginBottom: 20 }}>
        <FilterDialog filters={filters} onFilterChange={handleFilterChange}/>
      </Box>
      <TableContainer component={Paper}>
        <RadioGroup name="template-id" value={task.template.id} onChange={handleSelectionChange}>
          <Table aria-label="templates table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((value) => (
                <Row row={value} key={value.id} isOpen={openRow === value.id} setOpen={setOpenRow} />
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
        </RadioGroup>
      </TableContainer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getWizardTask(state),
    token: getToken(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobTemplatesSelectionTable);
