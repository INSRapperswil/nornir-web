import React, { useState, useEffect } from 'react';
import { getWizardTask, getToken } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';
import { getInventoryHosts } from '../api';
import { EnhancedTable } from './EnhancedTable';
import InventoryHostDetail from './InventoryHostDetail';


const headCells = [
  { id: 'name', numeric: false, label: 'Friendly Name', disablePadding: true },
  { id: 'hostname', numeric: false, label: 'Hostname' },
  { id: 'port', numeric: false, label: 'Port' },
  { id: 'groups', numeric: false, label: 'Groups', getValue: (value) => JSON.stringify(value) },
  { id: 'platform', numeric: false, label: 'Platform' },
];

function checkStepValidity(filters) {
  return (filters !== undefined && filters.length > 0);
}

function InventorySelectionTable({ token, task, updateTaskWizard, setStepValid }) {
  let [inventory, setInventory] = useState([]);

  const detailComponentFunction = (name) => {
    return <InventoryHostDetail inventoryId={task.inventory} name={name} />
  }

  useEffect(() => {
    if (inventory.length === 0) {
      getInventoryHosts(token, task.inventory).then((response) => {
        response.forEach((item, id) => item.id = id);
        setInventory(response);
        setStepValid(checkStepValidity(task.filters));
      });
    }
  }, [inventory, setInventory, token, task, setStepValid]);

  const handleSelectionChange = (params) => {
    updateTaskWizard({ filters: { hosts: params } });
    const valid = checkStepValidity(params);
    setStepValid(valid);
  }

  return (
    <div id="inventory-selection-table">
      <EnhancedTable
        rows={inventory}
        headCells={headCells}
        selectionKey="name"
        selected={task.filters.hosts}
        setSelected={handleSelectionChange}
        detailComponentFunction={detailComponentFunction}/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getWizardTask(state),
    token: getToken(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(InventorySelectionTable);
