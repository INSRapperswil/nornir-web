import React, { useState, useEffect } from 'react';
import { getWizardTask, getToken, getInventorySelectionId } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';
import { getInventoryHosts } from '../api';
import { EnhancedTable } from './EnhancedTable';
import InventoryHostDetail from './InventoryHostDetail';
import InventorySelector from './InventorySelector';
import { beautifyJson } from '../helperFunctions';

const headCells = [
  { id: 'name', numeric: false, label: 'Friendly Name', disablePadding: true },
  { id: 'hostname', numeric: false, label: 'Hostname' },
  { id: 'port', numeric: false, label: 'Port' },
  { id: 'groups', numeric: false, label: 'Groups', getValue: (value) => beautifyJson(value) },
  { id: 'platform', numeric: false, label: 'Platform' },
];

function checkStepValidity(filters) {
  return (filters !== undefined && filters.length > 0);
}

function InventorySelectionTable({ token, task, updateTaskWizard, setStepValid, inventorySelectionId }) {
  let [inventory, setInventory] = useState([]);
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(25);

  const detailComponentFunction = (name) => {
    return <InventoryHostDetail inventoryId={inventorySelectionId} name={name} />
  }

  useEffect(() => {
    if (inventory.length === 0) {
      getInventoryHosts(token, inventorySelectionId, rowsPerPage, 0).then((response) => {
        setInventory(response.results);
        setCount(response.count);
        setStepValid(checkStepValidity(task.filters));
      });
    }
  }, [inventory, setInventory, token, task, setStepValid, rowsPerPage, inventorySelectionId]);

  const handleSelectionChange = (params) => {
    updateTaskWizard({ filters: { hosts: params } });
    const valid = checkStepValidity(params);
    setStepValid(valid);
  }
  const handleChangePage = (event, requestedPage) => {
    const offset = requestedPage * rowsPerPage;
    getInventoryHosts(token, inventorySelectionId, rowsPerPage, offset).then((response) => {
      setInventory(response.results);
      setCount(response.count);
    })
    setPage(requestedPage);
  };

  const handleInventoryChange = (inventoryId) => {
    getInventoryHosts(token, inventoryId, rowsPerPage, 0).then((response) => {
      setInventory(response.results);
      setCount(response.count);
    });
    setPage(0);
  };

  const handleRowsPerPage = (event) => {
    const newPageSize = event.target.value;
    const newPage = parseInt(rowsPerPage * page / newPageSize);
    const offset = newPageSize * newPage;
    getInventoryHosts(token, inventorySelectionId, newPageSize, offset).then((response) => {
      setInventory(response.results);
      setCount(response.count);
    })
    setPage(newPage);
    setRowsPerPage(newPageSize);
  };

  return (
    <div id="inventory-selection-table">
      <InventorySelector onInventoryChange={handleInventoryChange} />
      <EnhancedTable
        rows={inventory}
        paginationDetails={{
          count, page, rowsPerPage,
          handleChangePage, handleRowsPerPage,
        }}
        headCells={headCells}
        selectionKey="name"
        selected={task.filters.hosts}
        setSelected={handleSelectionChange}
        detailComponentFunction={detailComponentFunction} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    inventorySelectionId: getInventorySelectionId(state),
    task: getWizardTask(state),
    token: getToken(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(InventorySelectionTable);
