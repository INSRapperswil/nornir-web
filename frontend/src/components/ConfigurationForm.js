import React, { useState, useEffect } from 'react';
import { getConfiguration, postConfiguration } from '../api';
import { getToken } from '../redux/reducers';
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
  alert: {
    marginTop: theme.spacing(1),
    width: '50ch',
  },
}));

function ConfigurationForm({ token }) {
  let [loadState, setLoadState] = useState({ "notLoaded": true });
  let [loggingEnabled, setLoggingEnabled] = useState({});
  let [loggingFormat, setLoggingFormat] = useState({});
  let [loggingLevel, setLoggingLevel] = useState({});
  let [loggingFile, setLoggingFile] = useState({});
  let [runnerOptionsNumWorkers, setRunnerOptionsNumWorkers] = useState({});
  let [runnerPlugin, setRunnerPlugin] = useState({});

  useEffect(() => {
    if (loadState.notLoaded) {
      getConfiguration(token).then((response) => {
        setLoadState(loadState.notLoaded = false);
        setLoggingEnabled(response.logging.enabled);
        setLoggingFormat(response.logging.format);
        setLoggingLevel(response.logging.level);
        setLoggingFile(response.logging.log_file);
        setRunnerOptionsNumWorkers(response.runner.options.num_workers);
        setRunnerPlugin(response.runner.plugin);
        console.log(response.logging.format);
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
  ]);

  const classes = useStyles();

  const handleLoggingEnabledChange = (event) => {
    console.log(event.target.checked);
    loggingEnabled = event.target.checked;
    setLoggingEnabled(loggingEnabled)
  };

  const handleLevelSelection = (event) => {
    console.log(event.target.value);
    loggingLevel = event.target.value;
    setLoggingLevel(loggingLevel);
  };

  const updateConfigurationHandler = () => {
    let configuration = {}
    postConfiguration(token, configuration);
  }

  try {
    return (
      <React.Fragment>
        <form noValidate className={classes.root} >
          <h2>Logging</h2>
          <FormControlLabel
            control={<Checkbox checked={loggingEnabled} onChange={handleLoggingEnabledChange} name="loggingEnabled" />}
            label="Logging Enabled"
          />
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="Logging Format" defaultValue={loggingFormat} />
          <FormControl variant="outlined" className={classes.textField}>
            <InputLabel id="logging-level-select-label">Logging Label</InputLabel>
            <Select
              labelId="logging-level-select-label"
              id="logging-level-select"
              onChange={handleLevelSelection}
              defaultValue={loggingLevel}
              label="Logging Level"
            >
              <MenuItem value="DEBUG">DEBUG</MenuItem>
              <MenuItem value="INFO">INFO</MenuItem>
              <MenuItem value="WARNING">WARNING</MenuItem>
              <MenuItem value="ERROR">CRITICAL</MenuItem>
            </Select>
          </FormControl>
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="Log File" defaultValue={loggingFile} />
          <h2>Runner options</h2>
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="Number of Workers" defaultValue={runnerOptionsNumWorkers} />
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="Runner Plugin" defaultValue={runnerPlugin} />

          <Button variant="contained" type="submit" onClick={updateConfigurationHandler}>Update Configuration</Button>
        </form>
      </React.Fragment>
    );
  } catch (error) {
    return (<Alert severity="error" className={classes.alert}>Failed to load configuration or invalid file format! Check your backend.</Alert>);
  }

}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(ConfigurationForm);