import React, { useState, useEffect } from 'react';
import { getInventoryList } from '../api';
import { getInventorySelection, getToken } from '../redux/reducers';
import { updateInventorySelection } from '../redux/actions';
import { connect } from 'react-redux';
import {
  FormControl, InputLabel, MenuItem, Select
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function InventorySelector({ token, inventory, updateInventorySelection }) {
  let [inventoryList, setInventoryList] = useState([]);

  useEffect(() => {
    if (inventoryList.length === 0) {
      getInventoryList(token).then((response) => setInventoryList(response.results))
    }
  }, [inventoryList, setInventoryList, token]);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 240,
    },
  }));

  const handleChange = (event) => {
    console.log(event.target.value);
    updateInventorySelection({inventory: event.target.value});
  };

  const classes = useStyles();

  return (
    console.log("Inventory ID: " + inventory.inventory),
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="inventory-select-label">Inventory</InputLabel>
      <Select
        labelId="inventory-select-label"
        id="inventory-select"
        onChange={handleChange}
        value={inventory.inventory}
        label="Inventory"
      >
        {
          Object.keys(inventoryList).map((key) => (
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