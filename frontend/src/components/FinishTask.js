import React from 'react';
import { getTaskWizard, getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import { Table, TableRow, TableCell, Paper, TableBody } from '@material-ui/core';

function FinishTask({ task }) {
  return (
    <div id="finish-task">
      <h2>Task Overview</h2>
      <Paper style={{ maxWidth: 600, marginBottom: 20 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>Name:</strong></TableCell>
              <TableCell>{task.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Scheduled:</strong></TableCell>
              <TableCell>
                { 
                  task.date_scheduled ?
                  <p>{new Date(task.date_scheduled).toLocaleString()}</p> :
                  <p>run now</p>
                }   
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Template:</strong></TableCell>
              <TableCell>{task.template.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Hosts:</strong></TableCell>
              <TableCell>
                {task.filters.map(item => {
                  return <p key={item}>hostname: {item}</p>
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getTaskWizard(state),
  };
};

export default connect(mapStateToProps)(FinishTask);
