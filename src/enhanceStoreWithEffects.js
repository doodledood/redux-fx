import isPlainObject from 'lodash/isPlainObject'
import {defaultEffectsRunner} from './defaultEffectsRunner'
import {EffectTypes, none} from './fx'

/**
 * @param {Function} A functions that knows how to handle effects.
 * @return {Function} A store enhancer that adds support for effects.
 */
export default function enhanceStoreWithEffects(effectsRunner = defaultEffectsRunner) {
  if (typeof effectsRunner !== "function") {
    throw Error("expected effectsRunner to be a function");
  }

  return (createStore) => (reducer, initialState, enhancer) => {
    var store = createStore(reducer, initialState, enhancer);
    var isDispatching = false;

    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error(
          'Actions must be plain objects. ' +
          'Use custom middleware for async actions.'
        )
      }

      if (typeof action.type === 'undefined') {
        throw new Error(
          'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
        )
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.')
      }

      let effect = none();
      try {
        isDispatching = true;

        [store.currentState, effect] = liftIntoStateAndEffects(store.currentReducer(store.currentState, action));
      } finally {
        isDispatching = false
      }

      let listeners = store.currentListeners = store.nextListeners;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }

      effectsRunner(effect, dispatch, store.getState);

      return action;
    }

    return Object.assign(store, {
      dispatch
    });
  }
}

export function liftIntoStateAndEffects(state) {
  if (Array.isArray(state) && state.length === 2 && isEffect(state[1])) {
    return state;
  }

  return [state, none()];
}

export function isEffect(obj) {
  return obj && Object.values(EffectTypes).includes(obj.type);
}
