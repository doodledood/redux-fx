/**
 * @param {Function} A reducer to enable support for effects for.
 * @return {Function} A decorated reducer that supports effects.
 */
export default function withFx(reducer) {
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
