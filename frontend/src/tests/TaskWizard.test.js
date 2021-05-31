import React, { useEffect } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../redux/reducers';
import thunkMiddleware from "redux-thunk";
import TaskWizard from '../components/TaskWizard';

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunkMiddleware))
);

function TestStep({setStepValid, i}) {
  useEffect(() => { setStepValid(true); });
  return (<h1>Component{i}</h1>)
}

function getSteps() {
  let steps = [];
  for (let i = 0; i < 3; i++) {
    steps.push({ label: 'Step' + i, component: (setStepValid) => <TestStep setStepValid={setStepValid} i={i} />, completed: false });
  }
  return steps;
}

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <TaskWizard steps={getSteps()}/>
    </Provider>
  );
  const next = getByText(/next/i).parentElement;
  expect(getByText(/Component0/i)).toBeInTheDocument();
  fireEvent.click(next);
  expect(getByText(/Component1/i)).toBeInTheDocument();
  fireEvent.click(next);
  expect(getByText(/Component2/i)).toBeInTheDocument();
  expect(getByText(/finish/i)).toBeInTheDocument();
  const back = getByText(/back/i).parentElement;
  fireEvent.click(back);
  expect(getByText(/Component1/i)).toBeInTheDocument();
});
