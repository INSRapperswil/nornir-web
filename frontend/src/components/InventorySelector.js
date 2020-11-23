import React, { useState, useEffect } from 'react';
import { getInventoryList } from '../api';
import { renewAccessToken, updateInventorySelection } from '../redux/actions';
import { checkAndGetToken, getInventorySelectionId, getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import {
  FormControl, InputLabel, MenuItem, Select
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function InventorySelector({ token, renewAccessToken, inventory, onInventoryChange, updateInventorySelection }) {
  let [inventoryList, setInventoryList] = useState([{ "id": 1, "name": "Loading...", "notLoaded": true }]);

  useEffect(() => {
    if (inventoryList[0].notLoaded) {
      checkAndGetToken(token, renewAccessToken).then((access_token) => {
        getInventoryList(access_token).then((response) => setInventoryList(response.results));
      });
    }
  }, [inventoryList, setInventoryList, token, renewAccessToken]);

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
    token: getToken(state),
  };
};

const mapDispatchToProps = {
  renewAccessToken,
  updateInventorySelection,
}

export default connect(mapStateToProps, mapDispatchToProps)(InventorySelector);