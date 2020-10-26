import React from 'react';
import { getTaskWizard, getToken } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';

function FinishTask({ token, task, updateTaskWizard }) {
  return (
    <div id="finish-task">
      <h2>Task Overview</h2>
      <p><strong>Name:</strong></p>
      <p>{task.name}</p>
      <p><strong>Scheduled: </strong></p> 
      { task.date_scheduled ?
        <p>{new Date(task.date_scheduled).toLocaleString()}</p> :
        <p>run now</p>
      }
      <p><strong>Template:</strong></p>
      <p>{task.template.name}</p>
      <p><strong>Hosts:</strong></p>
      {task.filters.map(item => {
        return <p key={item}>hostname: {item}</p>
      })}
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

export default connect(mapStateToProps, mapDispatchToProps)(FinishTask);
