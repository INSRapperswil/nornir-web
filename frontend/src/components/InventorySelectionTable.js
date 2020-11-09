import React, { useState, useEffect } from 'react';
import { getWizardTask, getToken, getInventorySelectionId } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';
import { getInventoryHosts } from '../api';
import { EnhancedTable } from './EnhancedTable';
import InventoryHostDetail from './InventoryHostDetail';
import InventorySelector from './InventorySelector';
import FilterDialog from './FilterDialog';
import { beautifyJson } from '../helperFunctions';
import {
  Box, TextField, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  box: {
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: 5,
    }
  },
}));

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
  let [search, setSearch] = useState('');
  let [filters, setFilters] = useState([
    { label: 'Name', name: 'name__contains', value: '' },
    { label: 'hostname', name: 'hostname__contains', value: '' },
    { label: 'Groups', name: 'groups__contains', value: '' },
    { label: 'Platform', name: 'platform__contains', value: '' },
  ]);

  const classes = useStyles();

  const detailComponentFunction = (name) => {
    return <InventoryHostDetail inventoryId={inventorySelectionId} name={name} />
  }

  useEffect(() => {
    if (inventory.length === 0) {
      getInventoryHosts(token, inventorySelectionId, rowsPerPage, 0, []).then((response) => {
        setInventory(response.results);
        setCount(response.count);
        setStepValid(checkStepValidity(task.filters));
      });
    }
  // empty dependencies array, so it only runs on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAndSetHosts = (page, pageSize, _filters=filters, _search=search) => {
    const offset = pageSize * page;
    getInventoryHosts(token, inventorySelectionId, pageSize, offset, _filters, _search).then((response) => {
      setInventory(response.results);
      setCount(response.count);
    })
  };

  const handleSelectionChange = (params) => {
    updateTaskWizard({ filters: { hosts: params } });
    const valid = checkStepValidity(params);
    setStepValid(valid);
  };
  const handleChangePage = (event, requestedPage) => {
    setPage(requestedPage);
    fetchAndSetHosts(requestedPage, rowsPerPage);
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
    setPage(newPage);
    setRowsPerPage(newPageSize);
    fetchAndSetHosts(newPage, newPageSize);
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
    setPage(0);
    fetchAndSetHosts(page, rowsPerPage, filters);
  };

  const handleSearch = (event) => {
    fetchAndSetHosts(0, rowsPerPage, filters, search);
  };

  return (
    <div id="inventory-selection-table">
      <Box className={classes.box}>
        <TextField
          label="Search Field"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch} variant="outlined">Search</Button>
        <FilterDialog filters={filters} onFilterChange={handleFilterChange}/>
      </Box>
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
