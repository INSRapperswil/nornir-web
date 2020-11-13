import React from 'react';
import InventorySelectionTable from '../components/InventorySelectionTable';
import JobTemplatesSelectionTable from '../components/JobTemplatesSelectionTable';
import VariableSetter from '../components/VariableSetter';
import FinishTask from '../components/FinishTask';
import TaskWizard from '../components/TaskWizard';
import { useLocation } from 'react-router-dom';

function getSteps(setStepValid) {
  return [
    {
      label: 'Select Inventory',
      component: <InventorySelectionTable setStepValid={setStepValid}/>,
      completed: false,
    },
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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function TaskWizardPage() {
  let query = useQuery();

  return (
    <div>
      <TaskWizard getSteps={getSteps} entryStep={query.get('step')}/>
    </div>
  );
}

export default TaskWizardPage;
