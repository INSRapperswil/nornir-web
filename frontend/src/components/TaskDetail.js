import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';

import { getTaskDetails } from '../api';
import { checkAndGetToken } from '../redux/actions'
import { beautifyJson } from '../helperFunctions';
import DetailTable from './DetailTable';

const useStyles = makeStyles({
  code:
  {
    display: "block",
    backgroundColor: "black",
    color: "white",
    padding: 16,
  },
  collapsed: {
    overflowY: "hidden",
    maxHeight: 240,
    '&::before': {
      textAlign: "center",
      content: '"Double click here to expand full result"',
      display: 'block',
      height: 30,
    },
    background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 25%)"
  },
  codeLine:
  {
    display: "inline-block",
    width: "100%",
    whiteSpace: "pre-wrap",
  },
});

function TaskDetail({ checkAndGetToken, taskId }) {
  let [task, setTask] = useState([]);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (task.length === 0) {
      checkAndGetToken().then((token) => {
        getTaskDetails(token, taskId).then((response) => {
          setTask(response);
          setIsLoading(false);
        });
      });
    }
  }, [checkAndGetToken, task, setTask, taskId]);

  const classes = useStyles();

  const onRefresh = () => {
    setIsLoading(true);
    checkAndGetToken().then((token) => {
      getTaskDetails(token, taskId).then((response) => {
        setTask(response);
        setIsLoading(false);
      });
    });
  };

  const handleExpansion = (event) => {
    event.target.expanded = !event.target.expanded;
    if (event.target.expanded) {
      event.target.className = classes.code;
    } else {
      event.target.className = classes.code + ' ' + classes.collapsed;
    }
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
          <Typography variant="h6" gutterBottom component="div">Result</Typography>
          <p>Status: {failed ? "FAILED" : "SUCCESS"}</p>
          {Object.values(hosts).map((host) => (
            <React.Fragment key={host.name}>
              <Typography variant="h6" gutterBottom component="div">{host["name"]} / {host["hostname"]}</Typography>
              <code className={`${classes.code} ${classes.collapsed}`} onDoubleClick={handleExpansion}>
                {Array.isArray(host["result"]) ?
                  host["result"].map((value) => {
                    return (
                      <span className={classes.codeLine} onDoubleClick={(e) => e.stopPropagation()} key={value}>
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
        Task Details
        <Button variant="contained" color="primary" onClick={onRefresh} size="small" style={{ marginLeft: 20 }} disabled={isLoading}>
          <RefreshIcon /><span style={{ marginLeft: 3 }}>Refresh</span>
        </Button>
      </Typography>
      <Result result={task["result"]} />
      <Typography variant="h6" gutterBottom component="div">Execution Parameters</Typography>
      <DetailTable detailObject={task} />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = {
  checkAndGetToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);
