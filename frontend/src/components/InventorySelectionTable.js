import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Tooltip } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { makeStyles } from '@material-ui/styles';

import { getInventoryHosts } from '../api';
import { checkAndGetToken, clearTaskWizard, updateTaskWizard } from '../redux/actions';
import { getInventorySelectionId, getWizardTask, } from '../redux/reducers';
import { beautifyJson, newOrderName } from '../helperFunctions';
import { EnhancedTable } from './EnhancedTable';
import InventoryHostDetail from './InventoryHostDetail';
import InventorySelector from './InventorySelector';
import FilterDialog from './FilterDialog';
import Search from './Search';

const useStyles = makeStyles({
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
});

const headCells = [
  { id: 'name', numeric: false, label: 'Friendly Name', disablePadding: true, orderable: true },
  { id: 'hostname', numeric: false, label: 'Hostname', orderable: true },
  { id: 'port', numeric: false, label: 'Port' },
  { id: 'groups', numeric: false, label: 'Groups', getValue: (value) => beautifyJson(value) },
  { id: 'platform', numeric: false, label: 'Platform', orderable: true },
];

export function checkStepValidity(filters) {
  return (filters !== undefined && filters.length > 0);
}

function InventorySelectionTable({ checkAndGetToken, task, updateTaskWizard, clearTaskWizard, setStepValid, inventorySelectionId }) {
  let [inventory, setInventory] = useState([]);
  let [count, setCount] = useState(0);
  let [page, setPage] = useState(0);
  let [rowsPerPage, setRowsPerPage] = useState(25);
  let [search, setSearch] = useState('');
  let [orderBy, setOrderBy] = useState('');
  const getDefaultFilters = () => {
    return [
      { label: 'Name', name: 'name__contains', value: '' },
      { label: 'Hostname', name: 'hostname__contains', value: '' },
      { label: 'Groups', name: 'groups__contains', value: '' },
      { label: 'Platform', name: 'platform__contains', value: '' },
    ];
  };
  let [filters, setFilters] = useState(getDefaultFilters());

  const classes = useStyles();

  const detailComponentFunction = (name) => {
    return <InventoryHostDetail inventoryId={inventorySelectionId} name={name} />
  }

  useEffect(() => {
    if (inventory.length === 0) {
      checkAndGetToken().then((token) => {
        getInventoryHosts(token, inventorySelectionId, rowsPerPage, 0, []).then((response) => {
          setInventory(response.results);
          setCount(response.count);
          setStepValid(checkStepValidity(task.filters.hosts));
        });
      });

    }
    // empty dependencies array, so it only runs on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAndSetHosts = (page, pageSize, _filters = filters, _search = search, _orderBy = orderBy) => {
    const offset = pageSize * page;
    checkAndGetToken().then((token) => {
      getInventoryHosts(token, inventorySelectionId, pageSize, offset, _filters, _search, _orderBy).then((response) => {
        setInventory(response.results);
        setCount(response.count);
      });
    });
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
    updateTaskWizard({ filters: { hosts: [] } });
    setStepValid(false);
    checkAndGetToken().then((token) => {
      getInventoryHosts(token, inventoryId, rowsPerPage, 0).then((response) => {
        setInventory(response.results);
        setCount(response.count);
      });
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

  const handleFilterSubmit = () => {
    setFilters(filters);
    setPage(0);
    fetchAndSetHosts(page, rowsPerPage, filters);
  };

  const handleSearch = (newSearch) => {
    setSearch(newSearch);
    fetchAndSetHosts(0, rowsPerPage, filters, newSearch);
  };

  const handleClearSearchFilter = (event) => {
    const newSearch = '';
    const newFilters = getDefaultFilters();
    setSearch(newSearch);
    setFilters(newFilters);
    fetchAndSetHosts(page, rowsPerPage, newFilters, newSearch, orderBy);
  };

  const handleOrderChange = (event, name) => {
    const newName = newOrderName(orderBy, name);
    fetchAndSetHosts(page, rowsPerPage, filters, search, newName);
    setOrderBy(newName);
  }

  return (
    <div id="inventory-selection-table" style={{ marginBottom: 20, marginTop: 10, }}>
      <Grid container>
        <Grid item className={classes.box} xs={6}>
          <InventorySelector onInventoryChange={handleInventoryChange} />
        </Grid>
        <Grid item className={`${classes.box} ${classes.filters}`} xs={6}>
          <Tooltip title="Clear Search and Filters">
            <Button variant="outlined" onClick={handleClearSearchFilter}>
              <HighlightOffIcon />
            </Button>
          </Tooltip>
          <FilterDialog filters={filters} onFilterSubmit={handleFilterSubmit} />
          <Search onSearchSubmit={handleSearch} />
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
  };
};
const mapDispatchToProps = {
  checkAndGetToken,
  updateTaskWizard,
  clearTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(InventorySelectionTable);
