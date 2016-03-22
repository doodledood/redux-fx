import collectAndClearEffectsFrom from './collectAndClearEffectsFrom'
import defaultEffectsRunner from './defaultEffectsRunner'

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

    function dispatch(action) {

      const dispatchedAction = store.dispatch(action);

      if (typeof action !== "object") {
        console.warn("The dispatched action is not an object and therefore redux-fx will not handle it.");
        return action;
      }

      const effects = collectAndClearEffectsFrom(action);

      if (!effects) {
        return action;
      }

      effectsRunner(effects, dispatch, store.getState);

      return action;
    }

    return Object.assign({}, store, {
      dispatch
    });
  }
}
