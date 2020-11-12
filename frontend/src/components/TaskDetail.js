import React, { useState, useEffect } from 'react';
import { getTaskDetails } from '../api';
import { getToken } from '../redux/reducers';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Typography, Button,
} from '@material-ui/core';
import { beautifyJson, objectToTable } from '../helperFunctions';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles({
  root:
  {
    maxWidth: 800,
  },
  code:
  {
    display: "block",
    backgroundColor: "black",
    color: "white",
    padding: 16,
  },
  codeLine:
  {
    display: "inline-block",
    width: "100%",
  },
});

function TaskDetail({ token, taskId }) {
  let [task, setTask] = useState([]);

  useEffect(() => {
    if (task.length === 0) {
      getTaskDetails(token, taskId).then((response) => setTask(response))
    }
  }, [task, setTask, token, taskId]);

  const classes = useStyles();

  const onRefresh = () => {
    getTaskDetails(token, taskId).then((response) => setTask(response))
  };

  function Result(props) {
    const { result } = props;
    let failed, hosts;

    if (typeof result !== "undefined") {
      failed = result["failed"];
      hosts = result["hosts"];
    }

    return (
      typeof hosts === "undefined" ? null :
        <React.Fragment>
          <Typography variant="h5" gutterBottom component="div">Result</Typography>
          <p>Status: {failed ? "FAILED" : "SUCCESS"}</p>
          {Object.values(hosts).map((host) => (
            <React.Fragment key={host.name}>
              <Typography variant="h6" gutterBottom component="div">{host["name"]} / {host["hostname"]}</Typography>
              <code className={classes.code}>
                {host["result"].map((value) => {
                  return (
                    <span className={classes.codeLine}>
                      {beautifyJson(value)}
                    </span>)
                })}
              </code>
            </React.Fragment>
          ))}
        </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom component="div">
        Details
        <Button variant="contained" color="primary" onClick={onRefresh} size="small" style={{ marginLeft: 20 }}>
          <RefreshIcon/><span style={{ marginLeft: 3 }}>Refresh</span>
        </Button>
      </Typography>
      <Table size="small" aria-label="data" className={classes.root}>
        <TableHead>
          <TableRow>
            <TableCell>Attribute</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(task).map((key) => (
            key === "result" || key === "detail" ? null :
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell>
                  {
                    typeof task[key] === "object" ?
                      objectToTable(task[key])
                      :
                      task[key]
                  }</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
      <Result result={task["result"]} />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(TaskDetail);
