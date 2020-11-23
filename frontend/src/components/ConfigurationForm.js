import React, { useState, useEffect } from 'react';
import { getConfiguration, postConfiguration } from '../api';
import { renewAccessToken } from '../redux/actions';
import { getToken, checkAndGetToken } from '../redux/reducers';
import { connect } from 'react-redux';
import {
  Button, Checkbox, FormControl, FormControlLabel, InputLabel, Select, MenuItem, TextField
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

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

function ConfigurationForm({ token, renewAccessToken, }) {
  let [loadState, setLoadState] = useState({ "notLoaded": true });
  let [loggingEnabled, setLoggingEnabled] = useState(false);
  let [loggingFormat, setLoggingFormat] = useState('');
  let [loggingLevel, setLoggingLevel] = useState('');
  let [loggingFile, setLoggingFile] = useState('');
  let [runnerOptionsNumWorkers, setRunnerOptionsNumWorkers] = useState('');
  let [runnerPlugin, setRunnerPlugin] = useState('');

  useEffect(() => {
    if (loadState.notLoaded) {
      checkAndGetToken(token, renewAccessToken).then((access_token) => {
        getConfiguration(access_token).then((response) => {
          setLoggingEnabled(response.logging.enabled);
          setLoggingFormat(response.logging.format);
          setLoggingLevel(response.logging.level);
          setLoggingFile(response.logging.log_file);
          setRunnerOptionsNumWorkers(response.runner.options.num_workers);
          setRunnerPlugin(response.runner.plugin);
          setLoadState(loadState.notLoaded = false);
        });
      });
    }
  }, [
    token,
    loadState, setLoadState,
    loggingEnabled, setLoggingEnabled,
    loggingFormat, setLoggingFormat,
    loggingLevel, setLoggingLevel,
    loggingFile, setLoggingFile,
    runnerOptionsNumWorkers, setRunnerOptionsNumWorkers,
    runnerPlugin, setRunnerPlugin,
    renewAccessToken,
  ]);

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
    postConfiguration(token, configuration);
  }

  return (loadState.notLoaded === true ?
    <Alert severity="info" className={classes.info}>Fetching configuration...</Alert>
    :
    <React.Fragment>
      <form noValidate className={classes.root} onSubmit={updateConfigurationHandler}>
        <h2>Logging</h2>
        <FormControlLabel control={<Checkbox checked={loggingEnabled} onChange={(e) => setLoggingEnabled(e.target.checked)} name="loggingEnabled" />} label="Logging Enabled" />
        <TextField id="loggingFormat" variant="outlined" className={[classes.textField, classes.loggingFormat].join(' ')} label="Logging Format" value={loggingFormat} onChange={(e) => setLoggingFormat(e.target.value)} />
        <FormControl variant="outlined" className={classes.textField}>
          <InputLabel id="loggingLevel-label">Logging Label</InputLabel>
          <Select labelId="loggingLevel-label" id="loggingLevel" onChange={(e) => setLoggingLevel(e.target.value)} value={loggingLevel} label="Logging Level">
            <MenuItem value="DEBUG">DEBUG</MenuItem>
            <MenuItem value="INFO">INFO</MenuItem>
            <MenuItem value="WARNING">WARNING</MenuItem>
            <MenuItem value="ERROR">ERROR</MenuItem>
            <MenuItem value="CRITICAL">CRITICAL</MenuItem>
          </Select>
        </FormControl>
        <TextField id="loggingFile" variant="outlined" className={classes.textField} label="Log File" value={loggingFile} onChange={(e) => setLoggingFile(e.target.value)} />

        <h2>Runner options</h2>
        <TextField id="runnerOptionsNumWorkers" variant="outlined" className={classes.textField} label="Number of Workers" value={runnerOptionsNumWorkers} onChange={(e) => setRunnerOptionsNumWorkers(e.target.value)} />
        <TextField id="runnerPlugin" variant="outlined" className={classes.textField} label="Runner Plugin" value={runnerPlugin} onChange={(e) => setRunnerPlugin(e.target.value)} />

        <Button variant="contained" type="submit">Update Configuration</Button>
      </form>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

const mapDispatchToProps = {
  renewAccessToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationForm);