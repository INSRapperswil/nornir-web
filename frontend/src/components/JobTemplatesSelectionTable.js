import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DataGrid } from '@material-ui/data-grid';
import { updateTaskWizard } from '../redux/actions';
import { getTaskWizard, getToken } from '../redux/reducers';
import { getJobTemplates } from '../api';
import { makeStyles } from '@material-ui/styles';


const columns = [
  { field: 'id', headerName: 'id' },
  { field: 'name', headerName: 'name' },
  { field: 'description', headerName: 'description' },
  { field: 'function_name', headerName: 'function_name' },
  { field: 'file_name', headerName: 'file name' },
  { field: 'package_path', headerName: 'package path' },
];

const useStyle = makeStyles((theme) => ({
  root: {
    '.MuiDataGrid-cellCheckbox': {
      backgroundColor: 'gray'
    }
  }
}));

function JobTemplatesSelectionTable({ token, task, updateTaskWizard }) {
  let [templates, setTemplates] = useState([]);
  let [loading, setLoading] = useState(true);
  let classes = useStyle();

  useEffect(() => {
    if (templates.length === 0) {
      getJobTemplates(token).then((response) => {
        setTemplates(response);
        setLoading(false);
      });
    }
  }, [templates, setTemplates, token]);

  const handleSelectionChange = (params) => {
    updateTaskWizard({ template: params.data.id });
  }

  return (
    <div id="job-templates-selection-table" style={{ height: 400, width: '100%' }}>
      <DataGrid
        className={classes.root}
        autoHeight="true"
        rows={templates}
        columns={columns}
        pageSize={50}
        loading={loading}
        onRowSelected={handleSelectionChange}
        />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    task: getTaskWizard(state),
    token: getToken(state),
  };
};
const mapDispatchToProps = {
  updateTaskWizard,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobTemplatesSelectionTable);
