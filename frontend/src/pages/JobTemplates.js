import React, { useState } from 'react';
import JobTemplatesSelectionTable from '../components/JobTemplatesSelectionTable';
import { Button } from '@material-ui/core';
import InventorySelectionTable from '../components/InventorySelectionTable';
import VariableSetter from '../components/VariableSetter';
import FinishTask from '../components/FinishTask';
import TaskWizard from '../components/TaskWizard';

function getSteps(setStepValid, onNext) {
  return [
    {
      label: 'Select Inventory',
      component: <InventorySelectionTable setStepValid={setStepValid}/>,
      completed: false,
    },
    {
      label: 'Set Variables',
      component: <VariableSetter setStepValid={setStepValid} onNext={onNext}/>,
      completed: false,
    },
    {
      label: 'Finish',
      component: <FinishTask setStepValid={setStepValid}/>,
      completed: false,
    },
  ];
}

function JobTemplates() {
  let [stepValid, setStepValid] = useState(false);
  let [runTaskWizard, setRunTaskWizard] = useState(false);

  const handleRunOnSelection = () => {
    setRunTaskWizard(true);
  };

  return (
    <div id="job-templates">
      <h1>Job Templates</h1>
      <Button
        onClick={handleRunOnSelection}
        disabled={!stepValid}
        variant="contained"
        color="primary">
          Run on Selection
      </Button>
      { runTaskWizard ? <TaskWizard getSteps={getSteps} /> :
      <JobTemplatesSelectionTable style={{ marginTop: 10 }} setStepValid={setStepValid}/> }
    </div>
  );
}

export default JobTemplates;
