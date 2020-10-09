import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { authenticate, runTask } from '../api';

function Prototype() {
  let [token, setToken] = useState('');
  let [result, setResult] = useState([]);
  
  useEffect(() => {
    if (token === '') {
      authenticate('felixkubli', 'v3rys3cur3').then((response) => setToken(response.token));
    }
  }, [token, setToken]);
  
  const params = {
    inventorySelection: [
      { hostname: '127.0.0.1' },
    ],
    template: { id: 1, name: 'hello_world' },
  };
  const handleRunTask = async (event) => {
    setResult([...result, await runTask(token, params)]);
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
      <h3>Job Template</h3>
      <p>Template: {params.template.name}</p>
      <Button variant="contained" onClick={handleRunTask}>run task</Button>
      <h3>Result</h3>
      {result.map((value, index) => {
        return <div key={index}>{JSON.stringify(value)}</div>
      })}
    </div>
  );
}

export default Prototype;
