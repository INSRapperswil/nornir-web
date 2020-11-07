import React, { useState, useEffect } from 'react';
import { getInventoryList } from '../api';
import { getInventorySelection, getToken } from '../redux/reducers';
import { updateInventorySelection } from '../redux/actions';
import { connect } from 'react-redux';
import {
  FormControl, InputLabel, MenuItem, Select
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function InventorySelector({ token, inventory, onInventoryChange, updateInventorySelection }) {
  let [inventoryList, setInventoryList] = useState([{ "id": 1, "name": "Loading...", "notLoaded": true }]);

  useEffect(() => {
    if (inventoryList[0].notLoaded) {
      getInventoryList(token).then((response) => setInventoryList(response.results));
    }
  }, [inventoryList, setInventoryList, token]);

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
        value={inventory.inventory}
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
    inventory: getInventorySelection(state),
    token: getToken(state),
  };
};

const mapDispatchToProps = {
  updateInventorySelection,
}

export default connect(mapStateToProps, mapDispatchToProps)(InventorySelector);