import React from 'react';
import './App.css';
import { AppBar, Button, Tab, Tabs } from '@material-ui/core';
import { TabPanel, tabProps} from './components/TabUtil';

function App() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <AppBar position="static">
        <h1 style={{marginLeft: 2 + 'rem'}}>nornUIr</h1>
        <Tabs value={value} onChange={handleChange} aria-label="page menu">
          <Tab label="Schedule Task" {...tabProps(0)}/>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <h1>Run a Task</h1>
        <Button variant="contained">run task</Button>
      </TabPanel>
    </div>
  );
}

export default App;
