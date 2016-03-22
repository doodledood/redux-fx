export default function collectAndClearEffectsFrom(obj) {
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
