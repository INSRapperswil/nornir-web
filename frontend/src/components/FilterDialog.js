import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Badge,
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

  const getFiltersActive = () => {
    let active = 0;
    for (const filter of filters) {
      if (filter.value) {
        active++;
      }
    }
    return active;
  }

  return (
    <React.Fragment>
      <Badge badgeContent={getFiltersActive()} color="primary">
        <Button variant="contained" onClick={(e) => setOpen(true)}>Filter</Button>
      </Badge>
      <Dialog open={open} onClose={(e) => setOpen(false)} aria-labelledby="filter-dialog">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Filters</DialogTitle>
          <DialogContent>
              {filters.map((filter, index) => {
                return <React.Fragment key={index}>
                  {
                    filter.component ? filter.component(filter.value) :
                    <div>
                      <TextField
                        label={filter.label}
                        name={filter.name}
                        defaultValue={filter.value}
                      />
                    </div>
                  }
                </React.Fragment>
              })}
          </DialogContent>
          <DialogActions>
            <Button type="reset">Clear Filter</Button>
            <Button type="submit">Apply Filter</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default FilterDialog;
