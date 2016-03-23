import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { fx, mapFx, enhanceStoreWithEffects, tag } from 'react-fx'

const App = connect({state, dispatch} => {
  return (
    <div>
      <Counter id="left" count={state.left} dispatch={tag(dispatch, "LEFT")} />
      <Counter id="right" count={state.right} dispatch={tag(dispatch, "RIGHT")} />
    </div>
  );
});

const Counter = ({count, dispatch} => {
  return (
    <div>
      <button onClick={() => dispatch({type:"INCREMENT"})}>+</button>
      <div>{count}</div>
      <button onClick={() => dispatch({type:"DECREMENT"})}>-</button>
    </div>
  );
});

const appReducer = (state, action) => {
  switch (action.type) {
    case "RIGHT":
      const [rightCounterState, rightCounterEffect] = counterReducer(state.right, action.childAction);
      return [
              {
                right: rightCounterState,
                left: state.left
              },
              mapFx(counterAction => {type: "RIGHT", counterAction}, rightCounterEffect)
            ];
    case "LEFT":
      const [leftCounterState, leftCounterEffect] = counterReducer(state.left, action.childAction);
      return [
              {
                right: state.right,
                left: leftCounterState
              },
              mapFx(counterAction => {type: "LEFT", counterAction}, leftCounterEffect)
            ];
    default:
      return state;
  }
};

const incrementWithDelay = seconds => dispatch => setTimeout(() => dispatch({type: "INCREMENT"}), seconds * 1000);

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT_DELAY":
      return [state, fx(incrementWithDelay, 1)];
    case "INCREMENT":
      return {count: state.count + 1};
    case "DECREMENT":
      return {count: state.count - 1};
    default:
      return state;
  }
};

const store = createStore(reducer, initialState, enhanceStoreWithEffects);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('app')
);
