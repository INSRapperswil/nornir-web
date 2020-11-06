import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateTaskWizard } from '../redux/actions';
import { getWizardTask, getToken } from '../redux/reducers';
import { getJobTemplates } from '../api';
import {
  RadioGroup, Radio,
  Table, TableHead, TableBody, TableContainer, TableRow, TableCell,
  TablePagination,
  Paper, FormControlLabel,
} from '@material-ui/core';

function JobTemplatesSelectionTable({ token, task, updateTaskWizard, setStepValid }) {
  let [templates, setTemplates] = useState([]);
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(25);

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
    const temp = templates.find(item => parseInt(params.target.value) === item.id);
    setStepValid(temp.id !== 0);
    updateTaskWizard({ template: temp });
  }

  const handleChangePage = (event, requestedPage) => {
    const offset = requestedPage * rowsPerPage;
    getJobTemplates(token, rowsPerPage, offset).then((response) => {
      setTemplates(response.results);
      setCount(response.count);
    })
    setPage(requestedPage);
  };

  const handleRowsPerPage = (event) => {
    const newPageSize = event.target.value;
    const newPage = parseInt(rowsPerPage * page / newPageSize);
    const offset = newPageSize * newPage;
    getJobTemplates(token, newPageSize, offset).then((response) => {
      setTemplates(response.results);
      setCount(response.count);
    })
    setPage(newPage);
    setRowsPerPage(newPageSize);
  };

  return (
    <div id="job-templates-selection-table">
      <TableContainer component={Paper}>
        <RadioGroup name="template-id" value={task.template.id} onChange={handleSelectionChange}>
          <Table aria-label="templates table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>select</TableCell>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((value, index) => (
                <TableRow
                  hover
                  onClick={(event) => handleSelectionChange({ target: { value: value.id } })}
                  selected={value.id === task.template.id}
                  key={index}>
                  <TableCell padding="checkbox">
                    <FormControlLabel value={value.id} control={<Radio/>}/>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {value.id}
                  </TableCell>
                  <TableCell>{value.name}</TableCell>
                  <TableCell>{value.description}</TableCell>
                  <TableCell>{value.file_path}</TableCell>
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
