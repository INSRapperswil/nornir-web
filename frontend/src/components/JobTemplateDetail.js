import React, { useState, useEffect } from 'react';
import { getJobTemplateDetails } from '../api';
import { renewAccessToken } from '../redux/actions';
import { checkTokenExpiry, getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import DetailTable from './DetailTable';

function JobTemplateDetail({ token, renewAccessToken, jobTemplateId }) {
  let [jobTemplate, setJobTemplate] = useState([]);

  useEffect(() => {
    if (jobTemplate.length === 0) {
      checkTokenExpiry(token, renewAccessToken);
      getJobTemplateDetails(token, jobTemplateId).then((response) => setJobTemplate(response))
    }
  }, [jobTemplate, setJobTemplate, token, jobTemplateId, renewAccessToken]);

  return (
    <DetailTable detailObject={jobTemplate} />
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

export default connect(mapStateToProps, mapDispatchToProps)(JobTemplateDetail);
