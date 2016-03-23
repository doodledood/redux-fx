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
    let currentEffect = none();
    var store = createStore(decorateReducer(reducer, effect => currentEffect = effect), initialState, enhancer);

    function dispatch(action) {
      const dispatchedAction = store.dispatch(action);

      effectsRunner(currentEffect, dispatch, store.getState);

      currentEffect = none();

      return dispatchedAction;
    }

    function replaceReducer(r) {
      return store.replaceReducer(decorateReducer(r));
    }

    return Object.assign({}, store, {
      dispatch,
      replaceReducer
    });
  }
}

export function decorateReducer(reducer, setEffect) {
  return (action, state) => {
    const [currentState, effect] = liftIntoStateAndEffects(reducer(action, state));
    setEffect(effect);

    return currentState;
  };
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
