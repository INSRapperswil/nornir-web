import React, { useState, useEffect } from 'react';
import { getJobTemplateDetails } from '../api';
import { getToken } from '../redux/reducers';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import { objectToTable } from '../helperFunctions';

function JobTemplateDetail({ token, jobTemplateId }) {
  let [jobTemplate, setJobTemplate] = useState([]);

  useEffect(() => {
    if (jobTemplate.length === 0) {
      getJobTemplateDetails(token, jobTemplateId).then((response) => setJobTemplate(response))
    }
  }, [jobTemplate, setJobTemplate, token, jobTemplateId]);

  const useStyles = makeStyles({
    root:
    {
      maxWidth: 800,
    },
  });

  const classes = useStyles();

  return (
    <Table size="small" aria-label="data" className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell>Attribute</TableCell>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(jobTemplate).map((key) => (
          key === "detail" ? null :
          <TableRow key={key}>
            <TableCell component="th" scope="row">
              {key}
            </TableCell>
            <TableCell>
              {
                typeof jobTemplate[key] === "object" ?
                  objectToTable(jobTemplate[key])
                  :
                  jobTemplate[key]
              }</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(JobTemplateDetail);
