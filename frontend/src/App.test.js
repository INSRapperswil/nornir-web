import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './redux/reducers';
import thunkMiddleware from "redux-thunk";

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunkMiddleware))
);

test('renders learn react link', () => {
  const { getByText } = render(<Provider store={store}><App/></Provider>);
  const linkElement = getByText(/nornir/i);
  expect(linkElement).toBeInTheDocument();
});
