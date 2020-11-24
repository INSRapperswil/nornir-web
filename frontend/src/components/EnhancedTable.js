import React, { useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  TablePagination, TableSortLabel, Tooltip,
  Checkbox, Paper, Typography, Collapse, Box, IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { orderDirection, isOrderActive } from '../helperFunctions';

function EnhancedTableHead({
  headCells,
  onSelectAllClick,
  numSelected,
  rowCount,
  orderBy,
  onSortChange
}) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          headCell.orderable ?
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderDirection(orderBy, headCell.id)}
            onClick={(e) => onSortChange(e, headCell.id)}
          >
            <TableSortLabel active={isOrderActive(orderBy, headCell.id)} direction={orderDirection(orderBy, headCell.id)}>
              {headCell.label}
            </TableSortLabel>
          </TableCell>
          :
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
          >
            {headCell.label}
          </TableCell>
        ))}
        <TableCell align="right">Detail View</TableCell>
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  row: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  detail: {
    backgroundColor: theme.palette.action.hover,
  },
}));
export default function EnhancedTable({
  headCells,
  rows,
  dense,
  selectionKey,
  selected,
  setSelected,
  detailComponentFunction,
  paginationDetails,
  onSortChange,
  orderBy,
}) {
  let {
    count, page, rowsPerPage,
    handleChangePage, handleRowsPerPage
  } = paginationDetails;
  const classes = useStyles();
  let [opened, setOpened] = useState([]);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n[selectionKey]);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelection = (items, name) => {
    const selectedIndex = items.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(items, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(items.slice(1));
    } else if (selectedIndex === items.length - 1) {
      newSelected = newSelected.concat(items.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        items.slice(0, selectedIndex),
        items.slice(selectedIndex + 1),
      );
    }
    return newSelected;
  }

  const handleCheckboxClick = (event, name) => {
    const newSelected = handleSelection(selected, name);
    setSelected(newSelected);
  };

  const setOpen = (event, name) => {
    event.stopPropagation();
    const newOpened = handleSelection(opened, name);
    setOpened(newOpened);
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const isOpen = (name) => opened.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              onSortChange={onSortChange}
              orderBy={orderBy}
              classes={classes}
              headCells={headCells}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row[selectionKey]);
                const isItemOpen = isOpen(row[selectionKey]);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <React.Fragment key={row[selectionKey]}>
                    <TableRow
                      hover
                      onClick={(event) => handleCheckboxClick(event, row[selectionKey])}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      className={classes.row}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      {headCells.map((cell, index) => {
                        return (
                          (index === 0) ?
                            <TableCell key={index} component="th" id={labelId} scope="row" padding="none">
                              {cell.getValue ? cell.getValue(row[cell.id]) : row[cell.id]}
                            </TableCell> :
                            <TableCell key={index}>
                              {cell.getValue ? cell.getValue(row[cell.id]) : row[cell.id]}
                            </TableCell>
                        )
                      })}
                      {detailComponentFunction ?
                        <TableCell align="right">
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={(event) => setOpen(event, row[selectionKey])}
                          >
                            {
                              isItemOpen ? <Tooltip title="Close Details"><KeyboardArrowUpIcon /></Tooltip> : 
                              <Tooltip title="Show Details"><KeyboardArrowDownIcon /></Tooltip>
                            }
                          </IconButton>
                        </TableCell>
                        : ''
                      }
                    </TableRow>
                    {
                      detailComponentFunction ?
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headCells.length + 2} className={classes.detail}>
                            <Collapse in={isItemOpen} timeout="auto" unmountOnExit style={{ paddingTop: 15, paddingBottom: 30 }}>
                              <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">Details</Typography>
                                {detailComponentFunction(row[selectionKey])}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                        : ''
                    }
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[2, 10, 25, 50]}
            rowsPerPage={rowsPerPage}
            page={page}
            count={count}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleRowsPerPage}
            component="div"/>
        </TableContainer>
      </Paper>
    </div>
  );
}

export { EnhancedTableHead, EnhancedTable };
