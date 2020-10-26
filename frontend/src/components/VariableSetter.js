import React, { useState, useEffect } from 'react';
import {
  Button, Checkbox, TextField, FormControlLabel,
} from '@material-ui/core';
import { getTaskWizard, getToken } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  textField: {
    marginBottom: theme.spacing(1),
    width: '50ch',
  },
  alert: {
    marginTop: theme.spacing(1),
    width: '50ch',
  }
}));

function VariableSetter({ token, task, updateTaskWizard, setStepValid }) {
  const [runNow, setRunNow] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    setStepValid(task.name !== '');
  }, [task, setStepValid]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;
    let taskAttr = {
      name: target['name'].value,
      date_scheduled: '',
      variables: {},
    };
    if(!runNow) {
      const scheduledDate = new Date(target['scheduled-date'].value + 'T' + target['scheduled-time'].value);
      taskAttr.date_scheduled = scheduledDate.toUTCString();
    }
    updateTaskWizard(taskAttr);
    setStepValid(taskAttr.name !== '');
  };
  
  const handleCheckedChange = (event) => setRunNow(event.target.checked);
  const getDefaultDate = () => {
    const now = new Date();
    return now.toISOString().substring(0, 10);
  }
  const getDefaultTime = () => {
    const now = new Date();
    return now.toISOString().substring(11, 16);
  }

  return (
    <div id="variable-setter">
      <h2>Set Variables</h2>
      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          id="name"
          required
          defaultValue={task.name}
          label="Name"
          className={classes.textField}
          variant="outlined"/>
        <FormControlLabel
          control={<Checkbox name="run-now" id="run-now" checked={runNow} onChange={handleCheckedChange}/>}
          label="Run Task Now"/>
        <TextField
          id="scheduled-date"
          type="date"
          className={classes.textField}
          defaultValue={getDefaultDate()}
          disabled={runNow}
          variant="outlined"
          label="Date Scheduled"/>
        <TextField
          id="scheduled-time"
          type="time"
          className={classes.textField}
          defaultValue={getDefaultTime()}
          disabled={runNow}
          variant="outlined"
          label="Time Scheduled"/>
        <Button type="submit" variant="contained">Save</Button>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getTaskWizard(state),
    token: getToken(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(VariableSetter);
