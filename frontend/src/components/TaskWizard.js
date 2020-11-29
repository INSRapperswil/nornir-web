import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { getWizardTask } from '../redux/reducers';
import { checkAndGetToken, updateTaskWizard, postTaskWizard, clearTaskWizard } from '../redux/actions';
import { Stepper, Step, StepLabel, Button } from '@material-ui/core';
import { runTask, runTaskAsync } from '../api';
import TaskDetail from './TaskDetail';
import { useHistory } from 'react-router-dom';

function TaskWizard({ checkAndGetToken, task, steps, postTaskWizard, clearTaskWizard, entryStep }) {
  const initiallyValid = () => {
    const step = parseInt(entryStep);
    let isValid = false;
    if(step) {
      for(let i=0; i < step; i++) {
        if(!('initiallyValid' in Object.keys(steps[i])) || steps[i].initiallyValid(task)) {
          isValid = true;
        } else {
          return 0;
        }
      }
    }
    if(isValid) {
      return step;
    } else {
      return 0;
    }
  }
  const [activeStep, setActiveStep] = useState(initiallyValid());
  const [stepValid, setStepValid] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState(0);
  const history = useHistory();
  const onNext = useRef();

  useEffect(() => {
    return () => {
      clearTaskWizard();
    }
  // empty dependencies array, so it only runs on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = (event) => {
    postTaskWizard().then(result => {
      checkAndGetToken().then((token) => {
        setCreatedTaskId(result.id);
        if (result.is_template) {
          history.push('/preconfigured-tasks');
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
    if(onNext && onNext.current) {
      onNext.current.onNext()
    }
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
      { activeStep !== 0 && activeStep < steps.length ? <Button onClick={handleBack}>Back</Button> : '' }
      { activeStep < steps.length-1 ? <Button onClick={handleNext} disabled={!stepValid} variant="contained" color="primary">Next</Button> : '' }
      { activeStep === steps.length-1 ? <Button onClick={handleFinish} variant="contained" color="primary">Finish</Button> : '' }
      { activeStep < steps.length ? steps[activeStep].component(setStepValid, onNext) : getCreatedTask() }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getWizardTask(state),
  };
};
const mapDispatchToProps = {
  checkAndGetToken,
  updateTaskWizard,
  postTaskWizard,
  clearTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskWizard);
