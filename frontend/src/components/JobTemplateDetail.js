import React, { useState, useEffect } from 'react';
import { getJobTemplateDetails } from '../api';
import { checkAndGetToken } from '../redux/actions';
import { connect } from 'react-redux';
import DetailTable from './DetailTable';

function JobTemplateDetail({ checkAndGetToken, jobTemplateId }) {
  let [jobTemplate, setJobTemplate] = useState([]);

  useEffect(() => {
    if (jobTemplate.length === 0) {
      checkAndGetToken().then((token) => {
        getJobTemplateDetails(token, jobTemplateId).then((response) => setJobTemplate(response))
      });
    }
  }, [checkAndGetToken, jobTemplate, setJobTemplate, jobTemplateId]);

  return (
    <DetailTable detailObject={jobTemplate} />
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  checkAndGetToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobTemplateDetail);
