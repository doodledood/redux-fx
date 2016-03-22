export default function defaultEffectsRunner(effects, dispatch, getState) {
  effects.forEach(effect => {
    const funcWithArgs = Array.isArray(effect.args) ? effect.func(...effect.args) : effect.func(effect.args);
    funcWithArgs(dispatch, getState);
  });
}
