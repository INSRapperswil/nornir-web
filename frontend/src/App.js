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
import Site404 from './pages/Site404';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './components/Logout';
import TaskWizardPage from './pages/TaskWizardPage';
import Configuration from './pages/Configuration';
import TaskTemplates from './pages/TaskTemplates';

function App() {
  const paths = [
    {
      label: 'Inventory',
      value: '/inventory',
      component: <Inventory />,
      protected: true,
    },
    {
      label: 'Tasks Dashboard',
      value: '/task-dashboard',
      component: <TaskDashboard />,
      protected: true,
    },
    {
      label: 'Task Templates',
      value: '/task-templates',
      component: <TaskTemplates/>,
      protected: true,
    },
    {
      label: 'Job Templates',
      value: '/job-templates',
      component: <JobTemplates />,
      protected: true,
    },
    {
      label: 'Task Wizard',
      value: '/wizard',
      component: <TaskWizardPage />,
      protected: true,
    },
    {
      label: 'Configuration',
      value: '/configuration',
      component: <Configuration />,
      protected: true,
    },
    {
      label: 'Login',
      value: '/login',
      component: <LoginPage />,
    },
    {
      label: 'Logout',
      value: '/logout',
      component: <Logout />,
      protected: true,
    },
  ];
  return (
    <div className="App">
      <Router>
        <AppBar position="static">
          <h1 style={{ marginLeft: 2 + 'rem' }}>nornir</h1>
          <NavTabs paths={paths} />
        </AppBar>
        <Container>
          <Switch>
            <Route exact path="/"><Redirect to={paths[0].value} /></Route>
            {paths.map((path) => {
              if (path.protected) {
                return <ProtectedRoute key={path.value} path={path.value}>{path.component}</ProtectedRoute>;
              } else {
                return <Route key={path.value} path={path.value}>{path.component}</Route>;
              }
            })}
            <Route path="*">
              <Site404 />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
}

export default App;
