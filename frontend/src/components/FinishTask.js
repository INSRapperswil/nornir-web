import React from 'react';
import { connect } from 'react-redux';
import { Paper, Table, TableCell, TableBody, TableRow, } from '@material-ui/core';

import { getWizardTask } from '../redux/reducers';

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
            {
              task.is_template ?
                <TableRow>
                  <TableCell><strong>Is Template:</strong></TableCell>
                  <TableCell>
                    <p>True</p>
                  </TableCell>
                </TableRow>
                :
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
            }
            <TableRow>
              <TableCell><strong>Template:</strong></TableCell>
              <TableCell>{task.template.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Variables:</strong></TableCell>
              <TableCell>
                {Object.keys(task.variables).map(item => {
                  return <p key={item}>{item}: {task.variables[item]}</p>
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Hosts:</strong></TableCell>
              <TableCell>
                {task.filters.hosts.map(item => {
                  return <p key={item}>host: {item}</p>
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
    task: getWizardTask(state),
  };
};

export default connect(mapStateToProps)(FinishTask);
