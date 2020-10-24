import React from 'react';
import InventorySelectionTable from '../components/InventorySelectionTable';
import InventoryTable from '../components/InventoryTable';

function Inventory() {
  return (
    <div id="inventory">
      <h1>Inventory</h1>
      {/* <InventoryTable/> */}
      <InventorySelectionTable/>
    </div>
  );
}

export default Inventory;
