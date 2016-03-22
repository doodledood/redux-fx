<big><h1 align="center">redux-fx</h1></big>

<p align="center">
  <a href="https://npmjs.org/package/redux-fx">
    <img src="https://img.shields.io/npm/v/redux-fx.svg?style=flat-square"
         alt="NPM Version">
  </a>

  <a href="https://coveralls.io/r/doodledood/redux-fx">
    <img src="https://img.shields.io/coveralls/doodledood/redux-fx.svg?style=flat-square"
         alt="Coverage Status">
  </a>

  <a href="https://travis-ci.org/doodledood/redux-fx">
    <img src="https://img.shields.io/travis/doodledood/redux-fx.svg?style=flat-square"
         alt="Build Status">
  </a>

  <a href="https://npmjs.org/package/redux-fx">
    <img src="http://img.shields.io/npm/dm/redux-fx.svg?style=flat-square"
         alt="Downloads">
  </a>

  <a href="https://david-dm.org/doodledood/redux-fx.svg">
    <img src="https://david-dm.org/doodledood/redux-fx.svg?style=flat-square"
         alt="Dependency Status">
  </a>

  <a href="https://github.com/doodledood/redux-fx/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/redux-fx.svg?style=flat-square"
         alt="License">
  </a>
</p>

<p align="center"><big>
A library for managing side effects for Redux, inspired by the Elm Architecture.
</big></p>


## Install

```sh
npm install redux-fx
```

## Usage

```js
import {enhanceStoreWithEffects, fx, withFx} from "redux-fx"

...

// Decorate createStore with enhanceStoreWithEffects to enable support for effects
const createStoreWithMiddleware = compose(
  applyMiddleware(someMiddleware),
  enhanceStoreWithEffects(),
  devTools()
)(createStore);

...

// Create effects of signature (any) => (dispatch, getState) => (any)
const incrementWithDelay = seconds => dispatch => setTimeout(() => dispatch({type: "INCREMENT"}), seconds * 1000);

...

// Use withFx to decorate your reducer so you can now write in elm-style.
// Use fx to create effect descriptors that are fully testable.
const reducer = withFx((state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return [{count: state.count + 1}, fx(incrementWithDelay, 1), fx(incrementWithDelay, 2)];
    case "DECREMENT":
      return {count: state.count - 1};
    default:
      return state;
  }
});

```

## License

MIT © [doodledood](http://github.com/doodledood)

[npm-url]: https://npmjs.org/package/redux-fx
[npm-image]: https://img.shields.io/npm/v/redux-fx.svg?style=flat-square

[travis-url]: https://travis-ci.org/doodledood/redux-fx
[travis-image]: https://img.shields.io/travis/doodledood/redux-fx.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/doodledood/redux-fx
[coveralls-image]: https://img.shields.io/coveralls/doodledood/redux-fx.svg?style=flat-square

[depstat-url]: https://david-dm.org/doodledood/redux-fx
[depstat-image]: https://david-dm.org/doodledood/redux-fx.svg?style=flat-square

[download-badge]: http://img.shields.io/npm/dm/redux-fx.svg?style=flat-square
