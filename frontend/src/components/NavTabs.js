import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from '@material-ui/core';

import { getIsAuthenticated } from '../redux/reducers';

function NavTabs({ paths, history, isAuthenticated, props }) {
  const handleCallToRouter = (event, value) => {
    history.push(value);
  }

  return (
    <Tabs value={ paths.find((item) => item.value === history.location.pathname && !item.hidden) ? history.location.pathname : '/null-tab' }
      onChange={handleCallToRouter}
      aria-label="page menu">
      {paths.map((path) => {
        if (isAuthenticated) {
          if (path.value !== '/login' && !path.hidden) {
            return (<Tab label={path.label} value={path.value} key={path.value} />);
          }
        } else if (!path.protected) {
          return (<Tab label={path.label} value={path.value} key={path.value} />);
        }
        return null;
      })}
      <Tab label="null-tab" value="/null-tab" hidden style={{ display: 'none' }}/>
    </Tabs>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: getIsAuthenticated(state),
  }
}

export default connect(mapStateToProps)(withRouter(NavTabs));
