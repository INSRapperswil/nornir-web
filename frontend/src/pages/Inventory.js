import React, { useState, useEffect } from 'react';
import { authenticate, getInventoryHosts } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


function Inventory() {
  let [token, setToken] = useState('');
  let [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (token === '') {
      authenticate('norbert', 'netzwerk').then((response) => {
        if (inventory.length === 0) {
          getInventoryHosts(response.token, "1").then((response) => setInventory(response));
        }
      });
    }
  }, [inventory, setInventory]);


  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const classes = useStyles();

  return (
    <div id="inventory">
      <h1>Inventory</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Friendly Name</TableCell>
              <TableCell>Hostname</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Groups</TableCell>
              <TableCell>Data-Attributes</TableCell>
              <TableCell>Platform</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((value, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {value.name}
                </TableCell>
                <TableCell>{value.hostname}</TableCell>
                <TableCell>{value.port}</TableCell>
                <TableCell>{value.groups}</TableCell>
                <TableCell>{JSON.stringify(value.data)}</TableCell>
                <TableCell>{value.platform}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}

export default Inventory;
