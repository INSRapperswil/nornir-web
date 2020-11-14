import React, { useState, useEffect } from 'react';
import { getJobTemplateDetails } from '../api';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';
import DetailTable from './DetailTable';

function JobTemplateDetail({ token, jobTemplateId }) {
  let [jobTemplate, setJobTemplate] = useState([]);

  useEffect(() => {
    if (jobTemplate.length === 0) {
      getJobTemplateDetails(token, jobTemplateId).then((response) => setJobTemplate(response))
    }
  }, [jobTemplate, setJobTemplate, token, jobTemplateId]);

  return (
    <DetailTable detailObject={jobTemplate} />
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(JobTemplateDetail);
