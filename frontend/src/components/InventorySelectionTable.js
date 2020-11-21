import React, { useState, useEffect } from 'react';
import { getWizardTask, getToken, getInventorySelectionId } from '../redux/reducers';
import { updateTaskWizard } from '../redux/actions';
import { connect } from 'react-redux';
import { getInventoryHosts } from '../api';
import { EnhancedTable } from './EnhancedTable';
import InventoryHostDetail from './InventoryHostDetail';
import InventorySelector from './InventorySelector';
import FilterDialog from './FilterDialog';
import { beautifyJson, newOrderName } from '../helperFunctions';
import {
  Grid, TextField, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  box: {
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginBottom: 5,
      marginRight: 10,
      marginTop: 5,
      marginLeft: 0,
    },
  },
  filters: {
    '& > *:last-child': {
      marginRight: 0,
    },
    justifyContent: 'flex-end',
  }
}));

const headCells = [
  { id: 'name', numeric: false, label: 'Friendly Name', disablePadding: true, orderable: true },
  { id: 'hostname', numeric: false, label: 'Hostname', orderable: true },
  { id: 'port', numeric: false, label: 'Port' },
  { id: 'groups', numeric: false, label: 'Groups', getValue: (value) => beautifyJson(value) },
  { id: 'platform', numeric: false, label: 'Platform', orderable: true },
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
  let [orderBy, setOrderBy] = useState('');
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
        setStepValid(checkStepValidity(task.filters.hosts));
      });
    }
  // empty dependencies array, so it only runs on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAndSetHosts = (page, pageSize, _filters=filters, _search=search, _orderBy=orderBy) => {
    const offset = pageSize * page;
    getInventoryHosts(token, inventorySelectionId, pageSize, offset, _filters, _search, _orderBy).then((response) => {
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

  const handleOrderChange = (event, name) => {
    const newName = newOrderName(orderBy, name);
    fetchAndSetHosts(page, rowsPerPage, filters, search, newName);
    setOrderBy(newName);
  }

  return (
    <div id="inventory-selection-table" style={{ marginBottom: 20, marginTop: 10, }}>
      <Grid container>
        <Grid item className={ classes.box } xs={6}>
          <InventorySelector onInventoryChange={handleInventoryChange} />
        </Grid>
        <Grid item className={`${classes.box} ${classes.filters}`} xs={6}>
          <FilterDialog filters={filters} onFilterChange={handleFilterChange}/>
          <Button onClick={handleSearch} variant="outlined">Search</Button>
          <TextField
            label="Search Field"
            variant="outlined"
            value={search}
            onKeyPress={(e) => e.key === 'Enter' ? handleSearch(e) : null}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>
      <EnhancedTable
        rows={inventory}
        paginationDetails={{
          count, page, rowsPerPage,
          handleChangePage, handleRowsPerPage,
        }}
        orderBy={orderBy}
        onSortChange={handleOrderChange}
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
