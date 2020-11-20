import React from 'react';
import TasksTable from '../components/TasksTable';

function PreconfiguredTasks() {
  return (
    <div id="tasks-templates">
      <h1>Task Templates</h1>
      <TasksTable onlyTemplates={true}/>
    </div>
  );
}

export default PreconfiguredTasks;
