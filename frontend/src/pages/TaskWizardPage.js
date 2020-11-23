import React from 'react';
import InventorySelectionTable, { checkStepValidity } from '../components/InventorySelectionTable';
import JobTemplatesSelectionTable from '../components/JobTemplatesSelectionTable';
import VariableSetter from '../components/VariableSetter';
import FinishTask from '../components/FinishTask';
import TaskWizard from '../components/TaskWizard';
import { useLocation } from 'react-router-dom';

function getSteps(fromTemplates) {
  let steps =  [
    {
      label: 'Select Inventory',
      component: (setStepValid, onNext) => <InventorySelectionTable setStepValid={setStepValid}/>,
      initiallyValid: (task) => checkStepValidity(task.filters.hosts),
      completed: false,
    },
    {
      label: 'Select Template',
      component: (setStepValid, onNext) => <JobTemplatesSelectionTable setStepValid={setStepValid}/>,
      initiallyValid: (task) => task.template.id !== 0,
      completed: false,
    },
    {
      label: 'Set Variables',
      component: (setStepValid, onNext) => <VariableSetter setStepValid={setStepValid} onNext={onNext}/>,
      completed: false,
    },
    {
      label: 'Finish',
      component: (setStepValid, onNext) => <FinishTask setStepValid={setStepValid}/>,
      completed: false,
    },
  ];
  if(fromTemplates === 'true') {
    const temp = steps[0];
    steps[0] = steps[1];
    steps[1] = temp;
  }
  return steps;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function TaskWizardPage() {
  let query = useQuery();

  return (
    <div>
      <TaskWizard
        steps={getSteps(query.get('from-templates'))}
        entryStep={query.get('step')}/>
    </div>
  );
}

export default TaskWizardPage;
