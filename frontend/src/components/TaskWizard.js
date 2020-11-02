import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getWizardTask, getWizard, getToken } from '../redux/reducers';
import { updateTaskWizard, postTaskWizard } from '../redux/actions';
import { Stepper, Step, StepLabel, Button } from '@material-ui/core';
import { runTask } from '../api';

function TaskWizard({ task, getSteps, postTaskWizard, wizard, token }) {
  const [activeStep, setActiveStep] = useState(0);
  const [stepValid, setStepValid] = useState(false);
  const steps = getSteps(setStepValid);

  const handleFinish = (event) => {
    postTaskWizard().then(result => {
      runTask(token, result);
    })
    handleNext(event);
  };
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
      { activeStep < steps.length ? steps[activeStep].component : <h2>Task Details: {wizard.lastCreatedTaskId}</h2> }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getWizardTask(state),
    wizard: getWizard(state),
    token: getToken(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
  postTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskWizard);
