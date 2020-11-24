import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
  Checkbox, TextField, FormControlLabel,
} from '@material-ui/core';
import { getWizardTask } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 30,
    marginBottom: 10,
  },
  textField: {
    marginBottom: theme.spacing(1),
    width: '50ch',
  },
  alert: {
    marginTop: theme.spacing(1),
    width: '50ch',
  },
}));

function VariableSetter({ task, updateTaskWizard, setStepValid, onNext }) {
  let [runNow, setRunNow] = useState(true);
  let [isTemplate, setIsTemplate] = useState(false);
  let [name, setName] = useState(task.name);
  const classes = useStyles();
  let [form, setForm] = useState({});

  useEffect(() => {
    setStepValid(name !== '');
  }, [name, setStepValid]);

  const handleFormChange = (event) => {
    if (!form['scheduled-date'] && !form['scheduled-time']) {
      form['scheduled-date'] = getDefaultDate();
      form['scheduled-time'] = getDefaultTime();
    }
    form[event.target.id] = event.target.value;
    setForm(form);
  };

  const handleSubmit = () => {
    let taskAttr = {
      name: name,
      date_scheduled: '',
      variables: {},
      is_template: isTemplate,
    };
    for (let variable of task.template.variables) {
      taskAttr.variables[variable] = form[variable].value;
    }
    if (!runNow) {
      const scheduledDate = new Date(form['scheduled-date'] + 'T' + form['scheduled-time']);
      taskAttr.date_scheduled = scheduledDate.toISOString();
    }
    updateTaskWizard(taskAttr);
    setStepValid(taskAttr.name !== '');
  };
  useImperativeHandle(onNext, () => { return { onNext: handleSubmit } });

  const handleCheckedChange = (event) => setRunNow(event.target.checked);
  const getDefaultDate = () => {
    const now = new Date();
    return now.toISOString().substring(0, 10);
  }
  const getDefaultTime = () => {
    const now = new Date();
    return now.toLocaleTimeString().substring(0, 5);
  }

  const handleIsTemplateChange = (event) => {
    setIsTemplate(event.target.checked);
  };

  return (
    <div id="variable-setter">
      <form className={classes.root} onSubmit={(e) => e.preventDefault()} onChange={handleFormChange}>
        <TextField
          id="name"
          required
          value={name}
          label="Task Name"
          onChange={(event) => setName(event.target.value)}
          className={classes.textField}
          variant="outlined" />
        <FormControlLabel
          control={<Checkbox name="is-template" id="is-template" checked={isTemplate} onChange={handleIsTemplateChange} />}
          label="Save as Preconfigured Task" />
        <h3>Set Variables</h3>
        <FormControlLabel
          control={<Checkbox name="run-now" id="run-now" checked={runNow} onChange={handleCheckedChange} />}
          disabled={isTemplate}
          label="Run Task Now" />
        <TextField
          id="scheduled-date"
          type="date"
          className={classes.textField}
          defaultValue={getDefaultDate()}
          disabled={runNow || isTemplate}
          variant="outlined"
          label="Date Scheduled" />
        <TextField
          id="scheduled-time"
          type="time"
          className={classes.textField}
          defaultValue={getDefaultTime()}
          disabled={runNow || isTemplate}
          variant="outlined"
          label="Time Scheduled" />
        {
          Array.isArray(task.template.variables) ? task.template.variables.map((variable) => {
            return <TextField
              key={variable}
              id={variable}
              className={classes.textField}
              variant="outlined"
              label={variable} />
          }) : ''
        }
      </form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getWizardTask(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(VariableSetter);
