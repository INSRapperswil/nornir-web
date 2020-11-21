import React, { useState } from 'react';
import InventorySelectionTable from '../components/InventorySelectionTable';
import { Button, Badge } from '@material-ui/core';
import JobTemplatesSelectionTable from '../components/JobTemplatesSelectionTable';
import VariableSetter from '../components/VariableSetter';
import FinishTask from '../components/FinishTask';
import TaskWizard from '../components/TaskWizard';
import { getWizardTask } from '../redux/reducers';
import { connect } from 'react-redux';

function getSteps(setStepValid, onNext) {
  return [
    {
      label: 'Select Template',
      component: <JobTemplatesSelectionTable setStepValid={setStepValid}/>,
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

function Inventory({ task }) {
  let [stepValid, setStepValid] = useState(false);
  let [runTaskWizard, setRunTaskWizard] = useState(false);

  const handleRunOnSelection = () => {
    setRunTaskWizard(true);
  };

  return (
    <div id="inventory">
      <h1>Inventory</h1>
      <Badge badgeContent={task.filters.hosts.length} color="secondary">
        <Button
          onClick={handleRunOnSelection}
          disabled={!stepValid}
          variant="contained"
          color="primary">
            Create Task with Selection
        </Button>
      </Badge>
      { runTaskWizard ? <TaskWizard getSteps={getSteps} /> :
      <InventorySelectionTable setStepValid={setStepValid}/> }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getWizardTask(state),
  };
}

export default connect(mapStateToProps)(Inventory);
