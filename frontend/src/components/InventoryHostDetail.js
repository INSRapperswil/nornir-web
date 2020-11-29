import React, { useState, useEffect } from 'react';
import { getHostDetails } from '../api';
import { checkAndGetToken } from '../redux/actions';
import { connect } from 'react-redux';
import DetailTable from './DetailTable';

function InventoryHostDetail({ checkAndGetToken, inventoryId, name }) {
  let [host, setHost] = useState([]);

  useEffect(() => {
    if (host.length === 0) {
      checkAndGetToken().then((token) => {
        getHostDetails(token, inventoryId, name).then((response) => setHost(response))
      });
    }
  }, [checkAndGetToken, host, setHost, inventoryId, name]);

  return (
    <DetailTable detailObject={host} />
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  checkAndGetToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryHostDetail);
