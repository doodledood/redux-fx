/**
 * @param {Function} A functions that knows how to handle effects.
 * @return {Function} A store enhancer that adds support for effects.
 */
export function enhanceStoreWithEffects(effectsRunner = defaultEffectsRunner) {
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

export function collectAndClearEffectsFrom(obj) {
  if (!obj) {
    return [];
  }

  return Object.keys(obj).reduce((effects, key) => {
    const value = obj[key];

    if (key === "__effects") {
      delete obj[key];
      return [...effects, ...value];
    }

    if (typeof value !== "object" || !value) {
      return effects;
    }

    return [...effects, ...collectAndClearEffectsFrom(value)];
  }, []);
}

/**
 * @param {Function} A reducer to enable support for effects for.
 * @return {Function} A decorated reducer that supports effects.
 */
export function withFx(reducer) {
  return (state, action) => {
    const result = reducer(state, action);

    if (Array.isArray(result)) {
      const [newState, ...effects] = result;

      if (!effects || effects.filter(effect => typeof effect === "object" && effect.type === "FX").length !== effects.length) {
        return result;
      }

      if (!action.__effects) {
        action.__effects = [...effects];
      } else {
        action.__effects.push(...effects);
      }

      return newState;
    }

    return result;
  };
}

export function fx(effect, ...args) {
  return {
    type: "FX",
    func: effect,
    args: args
  }
}

function defaultEffectsRunner(effects, dispatch, getState) {
  effects.forEach(effect => effect.func(effect.args)(dispatch, getState));
}
