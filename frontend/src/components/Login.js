import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import { authenticate } from '../redux/actions';

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

function Login({ error, authenticate }) {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successRedirect, setSuccessRedirect] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    authenticate(username, password).then(response => {
      setSuccessRedirect(true);
    });
  };

  if (successRedirect) {
    return <Redirect to="/inventory" />
  }

  return (
    <div id="login">
      <h1>Login</h1>
      <form noValidate className={classes.root} onSubmit={handleLogin}>
        <TextField
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          label="Username"
          variant="outlined"
          className={classes.textField} />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          className={classes.textField} />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </form>
      { error ? <Alert severity="error" className={classes.alert}>login not sucessful</Alert> : ''}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    error: state.user.error,
  };
}

const mapDispatchToProps = {
  authenticate,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
