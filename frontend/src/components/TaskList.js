import Task from "./Task";
import { connect } from "react-redux";
import { fetchTasks } from "../actions";

function TaskList(tasks) {
  return (
  <div id="tasks">
    {tasks.map((task) => {
      return (
        <Task task={task} />
      );
    })}
  </div>
  );
}

const mapStateToProps = (state) => {
  return {
    tasks: tasks,
  };
};

const mapDispatchToProps = {
  fetchTasks
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
