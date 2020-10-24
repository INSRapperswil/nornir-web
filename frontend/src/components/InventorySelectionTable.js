import React, { useState, useEffect } from 'react';
import { getTaskWizard, getToken } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';
import { getInventoryHosts } from '../api';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'id', headerName: 'id' },
  { field: 'name', headerName: 'name' },
  { field: 'hostname', headerName: 'hostname' },
  { field: 'port', headerName: 'port' },
  { field: 'platform', headerName: 'platform' },
  { field: 'groups', headerName: 'groups' },
  { field: 'data', headerName: 'data', valueGetter: (params) => JSON.stringify(params.getValue('data')) },
];

function InventorySelectionTable({ token, task, updateTaskWizard }) {
  let [inventory, setInventory] = useState([]);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inventory.length === 0) {
      getInventoryHosts(token, "1").then((response) => {
        response.forEach((item, id) => item.id = id);
        setInventory(response);
        setLoading(false);
      });
    }
  }, [inventory, setInventory, token]);

  const handleSelectionChange = (params) => {
    updateTaskWizard({ filters: params.rows });
  }

  return (
    <div id="inventory-selection-table" style={{ height: 400, width: '100%' }}>
      <DataGrid
        autoHeight="true"
        rows={inventory}
        columns={columns}
        pageSize={50}
        loading={loading}
        onSelectionChange={handleSelectionChange}
        checkboxSelection />
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
