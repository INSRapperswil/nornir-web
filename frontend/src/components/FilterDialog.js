import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField,
} from '@material-ui/core';

function FilterDialog({ filters, onFilterChange }) {
  let [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;
    for (let filter of filters) {
      filter.value = target[filter.name].value;
    }
    setOpen(false);
    onFilterChange(filters);
  }

  return (
    <React.Fragment>
      <Button variant="contained" onClick={(e) => setOpen(true)}>Filter</Button>
      <Dialog open={open} onClose={(e) => setOpen(false)} aria-labelledby="filter-dialog">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Filters</DialogTitle>
          <DialogContent>
              {filters.map((filter, index) => {
                return <div key={index}>
                  <TextField
                    label={filter.label}
                    name={filter.name}
                    defaultValue={filter.value}
                  />
                </div>
              })}
          </DialogContent>
          <DialogActions>
            <Button type="submit">Filter</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default FilterDialog;
