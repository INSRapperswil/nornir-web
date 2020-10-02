import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from '@material-ui/core';

function NavTabs({ paths, history, props }) {
  const handleCallToRouter = (event, value) => {
    history.push(value);
  }

  return (
    <Tabs value={history.location.pathname} 
          onChange={handleCallToRouter} 
          aria-label="page menu">
      {paths.map((path) => {
        return (<Tab label={path.label} value={path.value} key={path.value} />)
      })}
    </Tabs>
  );
}

export default withRouter(NavTabs);
