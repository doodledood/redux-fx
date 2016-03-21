import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { fx, withFx, enhanceStoreWithEffects } from 'react-fx'

const App = connect({state, dispatch} => {
  const count = state.count;

  return (
    <div>
      <button onClick={() => dispatch({type:"INCREMENT"})}>+</button>
      <div>{count}</div>
      <button onClick={() => dispatch({type:"DECREMENT"})}>-</button>
    </div>
  );
});

const incrementWithDelay = seconds => dispatch => setTimeout(() => dispatch({type: "INCREMENT"}), seconds * 1000);

const reducer = withFx((state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return [{count: state.count + 1}, fx(incrementWithDelay, 1), fx(incrementWithDelay, 2)];
    case "DECREMENT":
      return {count: state.count - 1};
    default:
      return state;
  }
});

const store = createStore(reducer, initialState, enhanceStoreWithEffects);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('app')
);
