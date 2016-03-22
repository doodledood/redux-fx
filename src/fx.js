export default function fx(effect, ...args) {
  return {
    type: "FX",
    func: effect,
    args: args
  }
}
