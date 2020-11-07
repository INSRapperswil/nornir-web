import React, { useState, useEffect } from 'react';
import { getConfiguration } from '../api';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import { Button, Checkbox, FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
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
  let [configuration, setConfiguration] = useState({ "notLoaded": true });

  useEffect(() => {
    if (configuration.notLoaded) {
      getConfiguration(token).then((response) => setConfiguration(response));
    }
  }, [configuration, setConfiguration, token]);

  const classes = useStyles();

  const handleLevelSelection= (event) => {
    console.log(event.target.value);
  }

  try {
    return (
      <React.Fragment>
        <form noValidate className={classes.root} >
          <h2>Logging</h2>
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="loggingEnabled" value={configuration.logging.enabled} />
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="loggingFormat" value={configuration.logging.format} />
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="loggingLevel" value={configuration.logging.level} />
          <FormControl variant="outlined" className={classes.textField}>
            <InputLabel id="demo-simple-select-outlined-label">loggingLevel</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onChange={handleLevelSelection}
              value={configuration.logging.level}
              label="loggingLevel"
            >
              <MenuItem value="DEBUG">DEBUG</MenuItem>
              <MenuItem value="INFO">INFO</MenuItem>
              <MenuItem value="WARNING">WARNING</MenuItem>
              <MenuItem value="ERROR">CRITICAL</MenuItem>
            </Select>
          </FormControl>
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="logFile" value={configuration.logging.log_file} />
          <h2>Runner options</h2>
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="numWorkers" value={configuration.runner.options.num_workers} />
          <TextField id="outlined-basic" variant="outlined" className={classes.textField} label="plugin" value={configuration.runner.plugin} />

          <Button variant="contained" type="submit">            Update Configuration        </Button>
        </form>
      </React.Fragment>
    );
  } catch (error) {
    return (<Alert severity="error" className={classes.alert}>Invalid Configuration file format!</Alert>);
  }

}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(ConfigurationForm);