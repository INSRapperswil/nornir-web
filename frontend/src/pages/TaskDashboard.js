import React from 'react';
import TasksTable from '../components/TasksTable';

function TaskDashboard() {
  return (
    <div id="tasks">
      <h1>Task Dashboard</h1>
      <TasksTable/>
    </div>
  );
}

export default TaskDashboard;
