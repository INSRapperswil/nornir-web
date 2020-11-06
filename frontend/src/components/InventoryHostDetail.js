import React, { useState, useEffect } from 'react';
import { getHostDetails } from '../api';
import { getToken } from '../redux/reducers';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { objectToTable } from '../helperFunctions';

function InventoryHostDetail({ token, inventoryId, name }) {
  let [host, setHost] = useState([]);

  useEffect(() => {
    if (host.length === 0) {
      getHostDetails(token, inventoryId, name).then((response) => setHost(response))
    }
  }, [host, setHost, token, inventoryId, name]);

  const useStyles = makeStyles({
    root:
    {
      maxWidth: 800,
    },
  });

  const classes = useStyles();

  return (
    <Table size="small" aria-label="data" className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell>Attribute</TableCell>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(host).map((key) => (
          key === "detail" ? null :
          <TableRow key={key}>
            <TableCell component="th" scope="row">
              {key}
            </TableCell>
            <TableCell>
              {
                typeof host[key] === "object" ?
                  objectToTable(host[key])
                  :
                  host[key]
              }</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(InventoryHostDetail);
