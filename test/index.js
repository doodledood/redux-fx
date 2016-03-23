import test from "tape"
import {fx, none, batch, mapFx, EffectTypes, tag} from "../src/fx"
import {dispatchWithMap} from "../src/defaultEffectsRunner"
import {liftIntoStateAndEffects, isEffect} from "../src/enhanceStoreWithEffects"

test("fx", t => {
  t.plan(1);

  const effect = i => dispatch => dispatch(i);
  const effectDescriptor = fx(effect, 1);

  t.deepEqual(effectDescriptor, {
    func: effect,
    args: [1],
    type: EffectTypes.FUNC
  }, "should return a runnable effect descriptor");
});

test("none", t => {
  t.plan(1);

  const effectDescriptor = none();

  t.deepEqual(effectDescriptor, {
    type: EffectTypes.NONE,
    args: undefined,
    func: undefined
  }, "should return an empty effect descriptor");
});

test("batch", t => {
  t.plan(1);

  const effects = [{id: 1, type: EffectTypes.FUNC}, {id: 2, type: EffectTypes.FUNC}];
  const effectDescriptor = batch(...effects);

  t.deepEqual(effectDescriptor, {
    type: EffectTypes.BATCH,
    subEffects: effects,
    args: undefined,
    func: undefined
  }, "should return a batched effect descriptor");
});

test("mapFx", t => {
  t.plan(1);

  const actionMapper = action => {
    child:action
  };
  const effectDescriptor = mapFx(actionMapper, {type: EffectTypes.FUNC});

  t.deepEqual(effectDescriptor, {
    type: EffectTypes.FUNC,
    actionMapper: actionMapper,
  }, "should return an effect descriptor with a mapper");
});

test("dispatchWithMap with a mapping function", t => {
  t.plan(2);

  const dispatch = action => {
    t.equal(action.mapped, true, "should dispatch the mapped action")
  };
  const mapFunc = () => {
    t.pass("should use a mapper function to dispatch");
    return {
      mapped: true
    }
  };
  const mappedDispatch = dispatchWithMap(mapFunc, dispatch);

  mappedDispatch({});
});

test("dispatchWithMap without a mapping function", t => {
  t.plan(1);

  const actionToDispatch = {id: 1};
  const dispatch = action => {
    t.deepEqual(actionToDispatch, action, "should dispatch the mapped action")
  };

  const mappedDispatch = dispatchWithMap(undefined, dispatch);

  mappedDispatch(actionToDispatch);
});

test("liftIntoStateAndEffects without effects", t => {
  t.plan(2);

  const state = {
    test: true
  };
  const [liftedState, effect] = liftIntoStateAndEffects(state);

  t.deepEqual(state, liftedState, "should return the same state");
  t.deepEqual({
    type: EffectTypes.NONE,
    args: undefined,
    func: undefined
  }, effect, "should return an empty effect");
});

test("liftIntoStateAndEffects with effects", t => {
  t.plan(2);

  const stateAndEffect = [
    {
      test: true
    },
    {
      type: EffectTypes.FUNC
    }
  ];
  const [liftedState, effect] = liftIntoStateAndEffects(stateAndEffect);

  t.deepEqual(stateAndEffect[0], liftedState, "should return the same state");
  t.deepEqual(stateAndEffect[1], effect, "should return the same effect");
});

test("isEffect with an effect", t => {
  t.plan(1);

  const effect = {
    type: EffectTypes.FUNC
  };
  const result = isEffect(effect);

  t.equal(result, true, "should return true");
});

test("isEffect with a non effect object", t => {
  t.plan(1);

  const nonEffect = {
    test: true
  };
  const result = isEffect(nonEffect);

  t.equal(result, false, "should return false");
});

test("tag", t => {
  t.plan(1);

  const originalAction = {type: "TEST"};
  const dispatch = action => {
    t.deepEqual(action, {type: "TAGGED", childAction: originalAction}, "should dispatch a tagged action")
  };
  tag(dispatch, "TAGGED")(originalAction);
});
