import React, { useState, useEffect } from 'react';
import { getHostDetails } from '../api';
import { renewAccessToken } from '../redux/actions';
import { getToken, checkTokenExpiry } from '../redux/reducers';
import { connect } from 'react-redux';
import DetailTable from './DetailTable';

function InventoryHostDetail({ token, renewAccessToken, inventoryId, name }) {
  let [host, setHost] = useState([]);

  useEffect(() => {
    if (host.length === 0) {
      checkTokenExpiry(token, renewAccessToken);
      getHostDetails(token, inventoryId, name).then((response) => setHost(response))
    }
  }, [host, setHost, token, inventoryId, name, renewAccessToken]);

  return (
    <DetailTable detailObject={host} />
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

const mapDispatchToProps = {
  renewAccessToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryHostDetail);
