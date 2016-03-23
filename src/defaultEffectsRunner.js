import {EffectTypes} from "./fx"

export function defaultEffectsRunner(effect, dispatch, getState) {
  if (!effect) {
    return;
  }

  runEffect(effect, dispatch, getState);
}

export function runEffect(effect, dispatch, getState) {
  switch (effect.type) {
    case EffectTypes.FUNC:
      const funcWithArgs = Array.isArray(effect.args) ? effect.func(...effect.args) : effect.func(effect.args);
      funcWithArgs(dispatchWithMap(effect.actionMapper, dispatch), getState);
      return;
    case EffectTypes.BATCH:
      effect.subEffects.forEach(subEffect => runEffect(subEffect, dispatch, getState));
      return;
    default:
      return;
  }
}

export function dispatchWithMap(mapFunc, dispatch) {
  const mapper = mapFunc || (x => x);
  return action => {
    dispatch(mapper(action));
  };
}
