import React from 'react';
import './App.css';
import { AppBar } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import NavTabs from './components/NavTabs';
import Inventory from './pages/Inventory';
import Tasks from './pages/Tasks';

function App() {
  const paths = [
    {
      label: 'Inventory',
      value: '/inventory',
      component: <Inventory/>,
    },
    {
      label: 'Tasks',
      value: '/tasks',
      component: <Tasks/>,
    },
  ];
  return (
    <div className="App">
      <Router>
        <AppBar position="static">
          <h1 style={{marginLeft: 2 + 'rem'}}>nornUIr</h1>
          <NavTabs paths={paths} />
        </AppBar>
        <Switch>
          {paths.map((path) => {
            return <Route key={path.value} path={path.value}>{path.component}</Route>
          })}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
