import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateTaskWizard } from '../redux/actions';
import { getTaskWizard, getToken } from '../redux/reducers';
import { getJobTemplates } from '../api';
import {
  RadioGroup, Radio,
  Table, TableHead, TableBody, TableContainer, TableRow, TableCell,
  Paper,
  FormControlLabel,
} from '@material-ui/core';

function JobTemplatesSelectionTable({ token, task, updateTaskWizard, setStepValid }) {
  let [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (templates.length === 0) {
      getJobTemplates(token).then((response) => {
        setTemplates(response);
        setStepValid(task.template.id !== 0);
      });
    }
  }, [templates, setTemplates, setStepValid, task, token]);

  const handleSelectionChange = (params) => {
    const temp = templates.find(item => parseInt(params.target.value) === item.id);
    setStepValid(temp.id !== 0);
    updateTaskWizard({ template: temp });
  }

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
        </RadioGroup>
      </TableContainer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getTaskWizard(state),
    token: getToken(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobTemplatesSelectionTable);
