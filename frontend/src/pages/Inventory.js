import React, { useState } from 'react';
import InventorySelectionTable from '../components/InventorySelectionTable';
import { Button } from '@material-ui/core';
import JobTemplatesSelectionTable from '../components/JobTemplatesSelectionTable';
import VariableSetter from '../components/VariableSetter';
import FinishTask from '../components/FinishTask';
import TaskWizard from '../components/TaskWizard';

function getSteps(setStepValid) {
  return [
    {
      label: 'Select Template',
      component: <JobTemplatesSelectionTable setStepValid={setStepValid}/>,
      completed: false,
    },
    {
      label: 'Set Variables',
      component: <VariableSetter setStepValid={setStepValid}/>,
      completed: false,
    },
    {
      label: 'Finish',
      component: <FinishTask setStepValid={setStepValid}/>,
      completed: false,
    },
  ];
}

function Inventory() {
  let [stepValid, setStepValid] = useState(false);
  let [runTaskWizard, setRunTaskWizard] = useState(false);

  const handleRunOnSelection = () => {
    setRunTaskWizard(true);
  };

  return (
    <div id="inventory">
      <h1>Inventory</h1>
      
      <Button onClick={handleRunOnSelection} disabled={!stepValid}>Run on Selection</Button>
      { runTaskWizard ? <TaskWizard getSteps={getSteps} /> :
      <InventorySelectionTable setStepValid={setStepValid}/> }
    </div>
  );
}

export default Inventory;
