import React, { useState, useEffect } from 'react';
import { getJobTemplates } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { getToken } from '../redux/reducers';
import { connect } from 'react-redux';

function JobTemplates({ token }) {
  let [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (templates.length === 0) {
      getJobTemplates(token).then((response) => setTemplates(response));
    }
  }, [templates, setTemplates, token]);

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const classes = useStyles();

  return (
    <div id="job-templates">
      <h1>Job Templates</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Path</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((value, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {value.id}
                </TableCell>
                <TableCell>{value.name}</TableCell>
                <TableCell>{value.description}</TableCell>
                <TableCell>{value.file_path}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(JobTemplates);
