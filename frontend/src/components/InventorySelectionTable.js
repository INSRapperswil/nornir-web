import React, { useState, useEffect } from 'react';
import { getTaskWizard, getToken } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';
import { getInventoryHosts } from '../api';
import { EnhancedTable } from './EnhancedTable';


const headCells = [
  { id: 'name', numeric: false, label: 'Friendly Name', disablePadding: true },
  { id: 'hostname', numeric: false, label: 'Hostname' },
  { id: 'port', numeric: false, label: 'Port' },
  { id: 'groups', numeric: false, label: 'Groups', getValue: (value) => JSON.stringify(value) },
  { id: 'data', numeric: false, label: 'Data-Attributes', getValue: (value) => JSON.stringify(value) },
  { id: 'platform', numeric: false, label: 'Platform' },
];

function InventorySelectionTable({ token, task, updateTaskWizard }) {
  let [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (inventory.length === 0) {
      getInventoryHosts(token, "1").then((response) => {
        response.forEach((item, id) => item.id = id);
        setInventory(response);
      });
    }
  }, [inventory, setInventory, token]);

  const handleSelectionChange = (params) => {
    updateTaskWizard({ filters: params });
  }

  return (
    <div id="inventory-selection-table">
      <EnhancedTable
        rows={inventory}
        headCells={headCells}
        selectionKey="hostname"
        selected={task.filters}
        setSelected={handleSelectionChange}/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getTaskWizard(state),
    token: getToken(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(InventorySelectionTable);
