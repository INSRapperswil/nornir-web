import React, { useState } from 'react';
import JobTemplatesSelectionTable from '../components/JobTemplatesSelectionTable';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { hasNetadminPermissions } from '../redux/reducers';

function JobTemplates({ hasPermission }) {
  let [stepValid, setStepValid] = useState(false);
  const history = useHistory();

  const handleRunOnSelection = () => {
    history.push('/wizard?step=1&from-templates=true');
  };

  return (
    <div id="job-templates">
      <h1>Job Templates</h1>
      {hasPermission ?
        <Button
          onClick={handleRunOnSelection}
          disabled={!stepValid}
          variant="contained"
          color="primary">
          Create Task with Selection
      </Button>
        : null}
      <JobTemplatesSelectionTable style={{ marginTop: 10 }} setStepValid={setStepValid} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    hasPermission: hasNetadminPermissions(state),
  };
}


export default connect(mapStateToProps)(JobTemplates);
