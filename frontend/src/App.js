import React from 'react';
import './App.css';
import { AppBar, Container } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import NavTabs from './components/NavTabs';
import Inventory from './pages/Inventory';
import TaskDashboard from './pages/TaskDashboard';
import JobTemplates from './pages/JobTemplates';
import Prototype from './pages/Prototype';

function App() {
  const paths = [
    {
      label: 'Inventory',
      value: '/inventory',
      component: <Inventory/>,
    },
    {
      label: 'Tasks Dashboard',
      value: '/task-dashboard',
      component: <TaskDashboard/>,
    },
    {
      label: 'Job Templates',
      value: '/job-templates',
      component: <JobTemplates/>
    },
    {
      label: 'Prototype',
      value: '/prototype',
      component: <Prototype/>
    },
  ];
  return (
    <div className="App">
      <Router>
        <AppBar position="static">
          <h1 style={{marginLeft: 2 + 'rem'}}>nornir</h1>
          <NavTabs paths={paths} />
        </AppBar>
        <Container>
          <Switch>
            <Route exact path="/"><Redirect to={paths[0].value} /></Route>
            {paths.map((path) => {
              return <Route key={path.value} path={path.value}>{path.component}</Route>
            })}
          </Switch>
        </Container>
      </Router>
    </div>
  );
}

export default App;
