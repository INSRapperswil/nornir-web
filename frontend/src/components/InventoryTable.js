import React, { useState, useEffect } from 'react';
import { getInventoryHosts } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import InventoryHostDetail from './InventoryHostDetail';

function InventoryTable({ token }) {
  let [inventory, setInventory] = useState([]);

  // TODO: load all inventories instead of a hardcoded one
  useEffect(() => {
    if (inventory.length === 0) {
      getInventoryHosts(token, "2").then((response) => setInventory(response));
    }
  }, [inventory, setInventory, token]);


  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell>{row.hostname}</TableCell>
          <TableCell>{row.port}</TableCell>
          <TableCell>{row.groups}</TableCell>
          <TableCell>{row.platform}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">Details</Typography>
                {/* TODO: do not use static inventoryId */}
                <InventoryHostDetail inventoryId="2" name={row.name} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Friendly Name</TableCell>
            <TableCell>Hostname</TableCell>
            <TableCell>Port</TableCell>
            <TableCell>Groups</TableCell>
            <TableCell>Platform</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(InventoryTable);
