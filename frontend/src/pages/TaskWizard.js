import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getTaskWizard } from '../redux/reducers';
import { updateTaskWizard, postTaskWizard } from '../redux/actions';
import { Stepper, Step, StepLabel, Button } from '@material-ui/core';
import InventorySelectionTable from '../components/InventorySelectionTable';
import JobTemplatesSelectionTable from '../components/JobTemplatesSelectionTable';
import VariableSetter from '../components/VariableSetter';
import FinishTask from '../components/FinishTask';


function TaskWizard({ task, postTaskWizard }) {
  const [activeStep, setActiveStep] = useState(0);
  const [stepValid, setStepValid] = useState(false);
  const steps = [
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

  const handleFinish = (event) => {
    postTaskWizard();
    handleNext(event);
  }
  const handleNext = (event) => {
    setStepValid(false);
    setActiveStep(activeStep + 1);
  };
  const handleBack = (event) => {
    if(activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div>
      <h1>Task Wizard</h1>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => {
          return (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      { activeStep !== 0 && activeStep < steps.length ? <Button onClick={handleBack}>Back</Button> : '' }
      { activeStep < steps.length-1 ? <Button onClick={handleNext} disabled={!stepValid}>Next</Button> : '' }
      { activeStep === steps.length-1 ? <Button onClick={handleFinish}>Finish</Button> : '' }
      { activeStep < steps.length ? steps[activeStep].component : <h2>Task Details: {task.date_started}</h2> }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getTaskWizard(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
  postTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskWizard);
