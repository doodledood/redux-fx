import test from "tape"
import withFx from "../src/withFx"
import fx from "../src/fx"
import collectAndClearEffectsFrom from "../src/collectAndClearEffectsFrom"

test("given an effect, return a testable effect descriptor", t => {
  t.plan(1);
  const effect = i => dispatch => dispatch(i);
  const effectDescriptor = fx(effect, 1);
  t.deepEqual(effectDescriptor, {func:effect,args:[1],type:"FX"});
});

test("given a reducer that does not use effects, return the same state", (t) => {
  t.plan(1);
  const reducer = withFx((state, action) => state);
  const state = {
    name: "test"
  };
  t.equal(reducer(state, {}), state);
});

test("given a reducer that uses effects, return the action merged with effects", (t) => {
  t.plan(1);
  const effects = [{id:"effectDescriptor1", type: "FX"}, {id:"effectDescriptor1", type: "FX"}];
  const reducer = withFx((state, action) => [state, ...effects]);
  const state = {
    name: "test"
  };
  const action = {};
  const newState = reducer(state, action);
  t.deepEqual(action, {
    __effects: effects
  });
});

test("given a nested state with effects, return the merged effects", (t) => {
  t.plan(1);
  const effects = [{id:1}, {id:2}, {id:3}];
  const collectedEffects = collectAndClearEffectsFrom({
    __effects: [effects[0]],
    nested: {
      name: "test",
      nested: {
        name: "test2",
        arr: ["test3"],
        __effects: [effects[1], effects[2]]
      }
    }
  });
  t.deepEqual(collectedEffects, effects);
});

test("given a nested state with effects, clears effects", (t) => {
  t.plan(1);
  const effects = [{id:1}, {id:2}, {id:3}];
  const state = {
    __effects: [effects[0]],
    nested: {
      name: "test",
      nested: {
        name: "test2",
        arr: ["test3"],
        __effects: [effects[1], effects[2]]
      }
    }
  };
  const collectedEffects = collectAndClearEffectsFrom(state);
  t.deepEqual({
    nested: {
      name: "test",
      nested: {
        name: "test2",
        arr: ["test3"]
      }
    }
  }, state);
});
