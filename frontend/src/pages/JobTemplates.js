import React, { useState } from 'react';
import JobTemplatesSelectionTable from '../components/JobTemplatesSelectionTable';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';


function JobTemplates() {
  let [stepValid, setStepValid] = useState(false);
  const history = useHistory();

  const handleRunOnSelection = () => {
    history.push('/wizard?step=1&from-templates=true');
  };

  return (
    <div id="job-templates">
      <h1>Job Templates</h1>
      <Button
        onClick={handleRunOnSelection}
        disabled={!stepValid}
        variant="contained"
        color="primary">
          Run on Selection
      </Button>
      <JobTemplatesSelectionTable style={{ marginTop: 10 }} setStepValid={setStepValid}/>
    </div>
  );
}

export default JobTemplates;
