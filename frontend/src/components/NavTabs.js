import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from '@material-ui/core';
import { getIsAuthenticated } from '../redux/reducers';
import { connect } from 'react-redux';

function NavTabs({ paths, history, isAuthenticated, props }) {
  const handleCallToRouter = (event, value) => {
    history.push(value);
  }

  return (
    <Tabs value={ paths.find((item) => item.value === history.location.pathname) ? history.location.pathname : '/login' }
      onChange={handleCallToRouter}
      aria-label="page menu">
      {paths.map((path) => {
        if (isAuthenticated) {
          if (path.value !== '/login') {
            return (<Tab label={path.label} value={path.value} key={path.value} />);
          }
        } else if (!path.protected) {
          return (<Tab label={path.label} value={path.value} key={path.value} />);
        }
        return '';
      })}
    </Tabs>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: getIsAuthenticated(state),
  }
}

export default connect(mapStateToProps)(withRouter(NavTabs));
