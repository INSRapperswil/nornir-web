import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateTaskWizard } from '../redux/actions';
import { getTaskWizard, getToken } from '../redux/reducers';
import { getJobTemplates } from '../api';
import { makeStyles } from '@material-ui/styles';
import {
  RadioGroup, Radio,
  Table, TableHead, TableBody, TableContainer, TableRow, TableCell,
  Paper,
  FormControlLabel,
} from '@material-ui/core';


const useStyle = makeStyles((theme) => ({
  root: {
  }
}));

function JobTemplatesSelectionTable({ token, task, updateTaskWizard }) {
  let [templates, setTemplates] = useState([]);
  let [loading, setLoading] = useState(true);
  let classes = useStyle();

  useEffect(() => {
    if (templates.length === 0) {
      getJobTemplates(token).then((response) => {
        setTemplates(response);
        setLoading(false);
      });
    }
  }, [templates, setTemplates, token]);

  const handleSelectionChange = (params) => {
    updateTaskWizard({ template: parseInt(params.target.value) });
  }

  return (
    <div id="job-templates-selection-table">
      <TableContainer component={Paper}>
        <RadioGroup name="template-id" value={task.template} onChange={handleSelectionChange}>
          <Table className={classes.table} aria-label="templates table" size="small">
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
                <TableRow key={index}>
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
