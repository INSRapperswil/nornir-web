import React, { useState } from 'react';
import {
  Badge, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';

function FilterDialog({ filters, onFilterSubmit }) {
  let [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;
    for (let filter of filters) {
      filter.value = target[filter.name].value;
    }
    setOpen(false);
    onFilterSubmit(filters);
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
        <Button variant="outlined" onClick={(e) => setOpen(true)}>Filter</Button>
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
            <Button type="submit">Apply Filter</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default FilterDialog;
