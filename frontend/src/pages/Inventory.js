import React, { useState } from 'react';
import InventorySelectionTable from '../components/InventorySelectionTable';
import { Button, Badge } from '@material-ui/core';
import { getWizardTask, hasNetadminPermissions } from '../redux/reducers';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Inventory({ hasPermission, task }) {
  let [stepValid, setStepValid] = useState(false);
  const history = useHistory();

  const handleRunOnSelection = () => {
    history.push('/wizard?step=1');
  };

  return (
    <div id="inventory">
      <h1>Inventory</h1>
      <Badge badgeContent={task.filters.hosts.length} color="secondary">
        <Button
          onClick={handleRunOnSelection}
          disabled={!stepValid || !hasPermission}
          variant="contained"
          color="primary">
          Create Task with Selection
        </Button>
      </Badge>
      <InventorySelectionTable setStepValid={setStepValid} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getWizardTask(state),
    hasPermission: hasNetadminPermissions(state),
  };
}

export default connect(mapStateToProps)(Inventory);
