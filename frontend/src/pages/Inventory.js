import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Badge, Button, } from '@material-ui/core';

import { getWizardTask, hasNetadminPermissions } from '../redux/reducers';
import InventorySelectionTable from '../components/InventorySelectionTable';

function Inventory({ hasPermission, task }) {
  let [stepValid, setStepValid] = useState(false);
  const history = useHistory();

  const handleRunOnSelection = () => {
    history.push('/wizard?step=1');
  };

  return (
    <div id="inventory">
      <h1>Inventory</h1>
      {hasPermission ?
        <Badge badgeContent={task.filters.hosts.length} color="secondary">
          <Button
            onClick={handleRunOnSelection}
            disabled={!stepValid}
            variant="contained"
            color="primary">
            Create Task with Selection
        </Button>
        </Badge>
        : null}
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
