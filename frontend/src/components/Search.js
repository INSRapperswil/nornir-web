import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function Search({ onSearchSubmit }) {
  let [search, setSearch] = useState('');

  const handleSearch = (event) => {
    onSearchSubmit(search);
  }

  return (
    <React.Fragment>
      <Button onClick={handleSearch} variant="outlined">Search</Button>
      <TextField
        label="Search Field"
        variant="outlined"
        value={search}
        onKeyPress={(e) => e.key === 'Enter' ? handleSearch(e) : null}
        onChange={(e) => setSearch(e.target.value)}
      />
    </React.Fragment>
  );
}

export default Search;
