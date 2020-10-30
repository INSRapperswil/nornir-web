import React, { useState, useEffect } from 'react';
import { getHostDetails } from '../api';
import { getToken } from '../redux/reducers';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function InventoryHostDetail({ token, inventoryId, name }) {
  let [host, setHost] = useState([]);

  useEffect(() => {
    if (host.length === 0) {
      getHostDetails(token, inventoryId, name).then((response) => setHost(response))
    }
  }, [host, setHost, token, inventoryId, name]);

  const useStyles = makeStyles(theme => ({
    root:
    {
      backgroundColor: theme.palette.action.hover,
      maxWidth: 800,
    },
  }));

  const classes = useStyles();

  function ObjectToTable(data) {
    return (
      <Table size="small" aria-label="data">
        <TableHead>
          <TableRow>
            <TableCell>Attribute</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(data).map((key) => (
            <TableRow>
              <TableCell>{key}</TableCell>
              <TableCell>{data[key]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

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
          <TableRow key={key}>
            <TableCell component="th" scope="row">
              {key}
            </TableCell>
            <TableCell>
              {
                typeof host[key] === "object" ?
                  ObjectToTable(host[key])
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
