import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getInventoryList } from '../api';
import { checkAndGetToken, updateInventorySelection } from '../redux/actions';
import { getInventorySelectionId } from '../redux/reducers';

function InventorySelector({ checkAndGetToken, inventory, onInventoryChange, updateInventorySelection }) {
  let [inventoryList, setInventoryList] = useState([{ "id": 1, "name": "Loading...", "notLoaded": true }]);

  useEffect(() => {
    if (inventoryList[0].notLoaded) {
      checkAndGetToken().then((token) => {
        getInventoryList(token).then((response) => setInventoryList(response.results));
      });
    }
  }, [checkAndGetToken, inventoryList, setInventoryList]);

  const useStyles = makeStyles({
    formControl: {
      minWidth: 240,
    },
  });

  const handleChange = (event) => {
    updateInventorySelection({ inventory: event.target.value });
    onInventoryChange(event.target.value);
  };

  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="inventory-select-label">Inventory</InputLabel>
      <Select
        labelId="inventory-select-label"
        id="inventory-select"
        onChange={handleChange}
        value={inventory}
        label="Inventory"
      >
        {Object.keys(inventoryList).map((key) => (
          <MenuItem key={inventoryList[key].id} value={inventoryList[key].id}>{inventoryList[key].name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const mapStateToProps = (state) => {
  return {
    inventory: getInventorySelectionId(state),
  };
};

const mapDispatchToProps = {
  checkAndGetToken,
  updateInventorySelection,
}

export default connect(mapStateToProps, mapDispatchToProps)(InventorySelector);