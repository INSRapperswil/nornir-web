import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { runTask } from '../api';

function Prototype() {
  const params = {
    inventorySelection: [
      { hostname: '127.0.0.1' },
    ],
    task: { taskId: 1, name: 'get configuration' },
  };
  const token = 'token';
  let [result, setResult] = useState('')

  const handleRunTask = async (event) => {
    setResult(await runTask(token, params));
  };

  return (
    <div id="prototype">
      <h1>Prototype</h1>
      <h2>Run the Task</h2>
      <h3>Inventory</h3>
      <ul>
        {params.inventorySelection.map((value) => {
          return <li key={value.hostname}>{value.hostname}</li>;
        })}
      </ul>
      <h3>Task</h3>
      <p>Task: {params.task.name}</p>
      <Button variant="contained" onClick={handleRunTask}>run task</Button>
      <h3>Result</h3>
      <div>{result}</div>
    </div>
  );
}

export default Prototype;
