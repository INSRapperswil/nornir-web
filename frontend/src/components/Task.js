import React from 'react';

export default function Task(task) {
  return (
    <div id="task">
      <h2>filters</h2>
      <p>{task.hostname}</p>
      {task.groups.map((name) => {
        return (<p>{name}</p>);
      })}
      <p>{task.platform}</p>
      <p>{task.result}</p>
    </div>
  );
}
