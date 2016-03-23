import {decorateReducer} from './enhanceStoreWithEffects'
import {none, batch} from './fx'

export default function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers)
  var finalReducers = {}
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i]
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  var finalReducerKeys = Object.keys(finalReducers)

  return function combination(state = {}, action) {

    var hasChanged = false;
    var nextState = {};
    var effect = none();
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = decorateReducer(finalReducers[key], (currentEffect) => effect = batch(currentEffect, effect));
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return [hasChanged ? nextState : state, effect];
  }
}
