import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';

import { logout } from '../redux/actions';

function Logout({ logout }) {
  const [loggedOut, setLoggedOut] = useState(false);
  const handleLogout = (event) => {
    logout();
    setLoggedOut(true);
  };
  if(loggedOut) {
    return (<Redirect to="/login" />);
  } else {
    return (
      <div id="logout" style={{margin: '2rem'}}>
        <Button onClick={handleLogout} variant="contained">Logout</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
