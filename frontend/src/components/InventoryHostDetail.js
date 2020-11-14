import React, { useState, useEffect } from 'react';
import { getHostDetails } from '../api';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import DetailTable from './DetailTable';

function InventoryHostDetail({ token, inventoryId, name }) {
  let [host, setHost] = useState([]);

  useEffect(() => {
    if (host.length === 0) {
      getHostDetails(token, inventoryId, name).then((response) => setHost(response))
    }
  }, [host, setHost, token, inventoryId, name]);

  return (
    <DetailTable detailObject={host} />
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(InventoryHostDetail);
