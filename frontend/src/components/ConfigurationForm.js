import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import { getConfiguration, postConfiguration } from '../api';
import { checkAndGetToken } from '../redux/actions';
import { hasSuperuserPermission } from '../redux/reducers';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '50ch',
  },
  loggingFormat: {
    width: '80ch',
  },
  info: {
    marginTop: theme.spacing(1),
    width: '50ch',
  },
}));

function ConfigurationForm({ checkAndGetToken, hasPermission }) {
  let [loadState, setLoadState] = useState({ "notLoaded": true });
  let [loggingEnabled, setLoggingEnabled] = useState(false);
  let [loggingFormat, setLoggingFormat] = useState('');
  let [loggingLevel, setLoggingLevel] = useState('');
  let [loggingFile, setLoggingFile] = useState('');
  let [runnerOptionsNumWorkers, setRunnerOptionsNumWorkers] = useState('');
  let [runnerPlugin, setRunnerPlugin] = useState('');

  useEffect(() => {
    if (loadState.notLoaded) {
      checkAndGetToken().then((token) => {
        getConfiguration(token).then((response) => {
          setLoadState(loadState.notLoaded = false);
          setLoggingEnabled(response.logging.enabled);
          setLoggingFormat(response.logging.format);
          setLoggingLevel(response.logging.level);
          setLoggingFile(response.logging.log_file);
          setRunnerOptionsNumWorkers(response.runner.options.num_workers);
          setRunnerPlugin(response.runner.plugin);
        });
      });
    }
    // empty dependencies array, so it only runs on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  const updateConfigurationHandler = (event) => {
    event.preventDefault();
    let configuration = {
      "logging": {
        "enabled": loggingEnabled,
        "format": loggingFormat,
        "level": loggingLevel,
        "log_file": loggingFile,
      },
      "runner": {
        "options": {
          "num_workers": parseInt(runnerOptionsNumWorkers),
        },
        "plugin": runnerPlugin,
      },
    };
    checkAndGetToken().then((token) => {
      postConfiguration(token, configuration);
    });
  }

  return (loadState.notLoaded === true ?
    <Alert severity="info" className={classes.info}>Fetching configuration...</Alert>
    :
    <React.Fragment>
      <form noValidate className={classes.root} onSubmit={updateConfigurationHandler}>
        <h2>Logging</h2>
        <FormControlLabel
          control={
            <Checkbox
              checked={loggingEnabled}
              onChange={(e) => setLoggingEnabled(e.target.checked)}
              name="loggingEnabled"
              disabled={!hasPermission} />
          }
          label="Logging Enabled" />
        <TextField
          id="loggingFormat"
          variant="outlined"
          className={`${classes.textField} ${classes.loggingFormat}`}
          value={loggingFormat}
          disabled={!hasPermission}
          label="Logging Format"
          onChange={(e) => setLoggingFormat(e.target.value)} />

        <FormControl variant="outlined" className={classes.textField}>
          <InputLabel id="loggingLevel-label">Logging Label</InputLabel>
          <Select
            labelId="loggingLevel-label"
            id="loggingLevel"
            onChange={(e) => setLoggingLevel(e.target.value)}
            value={loggingLevel}
            disabled={!hasPermission}
            label="Logging Level">
            <MenuItem value="DEBUG">DEBUG</MenuItem>
            <MenuItem value="INFO">INFO</MenuItem>
            <MenuItem value="WARNING">WARNING</MenuItem>
            <MenuItem value="ERROR">ERROR</MenuItem>
            <MenuItem value="CRITICAL">CRITICAL</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="loggingFile"
          variant="outlined"
          className={classes.textField}
          label="Log File"
          value={loggingFile}
          disabled={!hasPermission}
          onChange={(e) => setLoggingFile(e.target.value)} />

        <h2>Runner options</h2>
        <TextField
          id="runnerOptionsNumWorkers"
          variant="outlined"
          className={classes.textField}
          label="Number of Workers"
          value={runnerOptionsNumWorkers}
          disabled={!hasPermission}
          onChange={(e) => setRunnerOptionsNumWorkers(e.target.value)} />
        <TextField
          id="runnerPlugin"
          variant="outlined"
          className={classes.textField}
          label="Runner Plugin"
          value={runnerPlugin}
          disabled={!hasPermission}
          onChange={(e) => setRunnerPlugin(e.target.value)} />

        <Button variant="contained" type="submit" disabled={!hasPermission}>Update Configuration</Button>
      </form>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    hasPermission: hasSuperuserPermission(state),
  };
};

const mapDispatchToProps = {
  checkAndGetToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationForm);