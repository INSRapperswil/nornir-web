import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { runTask, createTask, getTask, runTaskAsync } from '../api';
import { connect } from 'react-redux';
import { getToken } from '../redux/reducers';

function Prototype({ token }) {
  let [results, setResults] = useState([]);
  let [taskId, setTaskId] = useState({});
  
  const template = {
    id: 1,
    name: 'hello_world',
  };
  const taskParams = {
    name: 'prototype hello_world execution',
    filters: { hostname: '127.0.0.1' },
    template: template.id,
  };

  const handleRunTask = async (event) => {
    const task = await createTask(token, taskParams);
    setTaskId(task.id);
    const result = await runTask(token, task.id);
    setResults([...results, result]);
  };

  const handleRunTaskAsync = async (event) => {
    const task = await createTask(token, taskParams);
    setTaskId(task.id);
    await runTaskAsync(token, task.id);
    const result = await getTask(token, task.id);
    setResults([...results, result]);
  };

  const handleGetTask = async (event) => {
    const result = await getTask(token, taskId);
    setResults([...results, result]);
  };

  return (
    <div id="prototype">
      <h1>Prototype</h1>
      <h2>Run the Task</h2>
      <h3>Filter</h3>
      <ul>
  <li>hostname: { taskParams.filters.hostname }</li>
      </ul>
      <h3>Job Template</h3>
      <p>Template: {template.name}</p>
      <Button variant="contained" onClick={handleRunTask}>create and run task</Button>
      <Button variant="contained" onClick={handleRunTaskAsync}>create and run task async</Button>
      <Button variant="contained" onClick={handleGetTask}>get task result</Button>
      <h3>Result</h3>
      {results.map((value, index) => {
        return <p key={index}>ID: {value.id}, status: {value.status}, result: {JSON.stringify(value.result)}</p>
      })}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(Prototype);
