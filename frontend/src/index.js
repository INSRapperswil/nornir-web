import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import './index.css';
import App from './App';
import rootReducer from './redux/reducers';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from 'redux';

// Hook the redux developer tools browser extension into our store:
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// The thunkMiddleware lets us dispatch actions from within other
// (asynchronuous) actions. This makes it possible to have a single
// action that is invoked by the component to perform multiple steps.
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
