import React, { useState, useEffect } from 'react';
import { getTaskDetails } from '../api';
import { getToken } from '../redux/reducers';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { beautifyJson } from '../helperFunctions';
import DetailTable from './DetailTable';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles({
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
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (task.length === 0) {
      getTaskDetails(token, taskId).then((response) => {
        setTask(response);
        setIsLoading(false);
      });
    }
  }, [task, setTask, token, taskId]);

  const classes = useStyles();

  const onRefresh = () => {
    setIsLoading(true);
    getTaskDetails(token, taskId).then((response) => {
      setTask(response);
      setIsLoading(false);
    });
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
                {Array.isArray(host["result"]) ?
                  host["result"].map((value) => {
                    return (
                      <span className={classes.codeLine} key={value}>
                        {beautifyJson(value)}
                      </span>)
                  })
                  :
                  beautifyJson(host["result"])
                }
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
        <Button variant="contained" color="primary" onClick={onRefresh} size="small" style={{ marginLeft: 20 }} disabled={isLoading}>
          <RefreshIcon /><span style={{ marginLeft: 3 }}>Refresh</span>
        </Button>
      </Typography>
      <Result result={task["result"]} />
      <DetailTable detailObject={task} />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    token: getToken(state),
  };
};

export default connect(mapStateToProps)(TaskDetail);
