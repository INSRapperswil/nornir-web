import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect  } from 'react-redux';
import { getIsAuthenticated } from '../redux/reducers';


function ProtectedRoute({children, isAuthenticated, ...props}) {
  return (
    <Route
      {...props}
      render={({ location }) =>
        isAuthenticated ? (children) :
        <Redirect to={{
          pathname: "/login",
          state: { from: location }
        }}/>
      }
    />
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: getIsAuthenticated(state),
  }
};

export default connect(mapStateToProps)(ProtectedRoute);
