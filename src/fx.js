export function none() {
  return createFx(EffectTypes.NONE);
}

export function fx(effectFunc, ...args) {
  return createFx(EffectTypes.FUNC, effectFunc, args);
}

export function batch(...effects) {
  const subEffects = Array.isArray(effects) ? effects : [effects];
  return Object.assign(createFx(EffectTypes.BATCH), {
    subEffects
  });
}

// actionMapper: actionA => actionB
export function mapFx(actionMapper, fx) {
  if (typeof actionMapper !== 'function') {
    throw new Error("expected actionMapper to be a function.");
  }

  return Object.assign({}, fx, {
    actionMapper
  });
}

export function tag(dispatch, type) {
  return childAction => dispatch({
    type: type,
    childAction: childAction
  });
}

export const EffectTypes = {
  NONE: "FX_NONE",
  FUNC: "FX_FUNC",
  BATCH: "FX_BATCH"
}

function createFx(type, func, args) {
  return {
    type: type,
    func: func,
    args: args
  }
}
