import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getWizardTask, getWizard, getToken, checkAndGetToken } from '../redux/reducers';
import { updateTaskWizard, postTaskWizard, renewAccessToken } from '../redux/actions';
import { Stepper, Step, StepLabel, Button } from '@material-ui/core';
import { runTask, runTaskAsync } from '../api';
import TaskDetail from './TaskDetail';
import { useHistory } from 'react-router-dom';

function TaskWizard({ task, getSteps, postTaskWizard, wizard, token, entryStep }) {
  const [activeStep, setActiveStep] = useState(entryStep ? parseInt(entryStep) : 0);
  const [stepValid, setStepValid] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState(0);
  const history = useHistory();
  const steps = getSteps(setStepValid);

  const handleFinish = (event) => {
    postTaskWizard().then(result => {
      checkAndGetToken(token, renewAccessToken).then((access_token) => {
        setCreatedTaskId(result.id);
        if (result.is_template) {
          history.push('/task-templates');
        } else {
          if (result.date_scheduled) {
            runTaskAsync(token, result.id)
          } else {
            runTask(token, result.id);
          }
        }
      });
    })
    handleNext(event);
  };
  const handleNext = (event) => {
    setStepValid(false);
    setActiveStep(activeStep + 1);
  };
  const handleBack = (event) => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  const getCreatedTask = () => {
    return (createdTaskId > 0) ? <TaskDetail taskId={createdTaskId} /> : '';
  }

  return (
    <div style={{ marginBottom: 20 }}>
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
      { activeStep !== 0 && activeStep < steps.length ? <Button onClick={handleBack}>Back</Button> : ''}
      { activeStep < steps.length - 1 ? <Button onClick={handleNext} disabled={!stepValid} variant="contained" color="primary">Next</Button> : ''}
      { activeStep === steps.length - 1 ? <Button onClick={handleFinish} variant="contained" color="primary">Finish</Button> : ''}
      { activeStep < steps.length ? steps[activeStep].component : getCreatedTask()}
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
  renewAccessToken,
  updateTaskWizard,
  postTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskWizard);
