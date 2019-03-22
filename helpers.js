// Idea from the last code snippet in https://medium.freecodecamp.org/get-pro-with-react-setstate-in-10-minutes-d38251d1c781
  // Original:
    // const makeUpdater = apply => key => state => ({ [key]: apply(state[key]), });
      /* 
        Not as flexible as below versions. Can only be used to change one key.
        Doesn't allow for:
          - additional parameters for more complex updaters to be made
          - adding new keys and/or changing multiple keys together
      */ 

/* 
  this.state should not be relied upon for calculating new state because setState is async so you risk accessing the value of this.state
  before a queued update. This problem is averted by passing setState a function which it will call and pass the current state and props to.

  Explanation with toggleKey as example:

      1. makeUpdater is passed one arg `apply`, which is a function
      2. makeUpdater returns a fn stored in const `toggleKey` which can accept any number of args when called
      3. When `toggleKey` is called, another fn is returned which is the fn that setState will use as a callback
      4. setState invokes the callback and passes the current state as an arg
      5. the setState callback calls `apply` and passes the current state and all of the args passed to the toggleKey fn
        in this case, only a key name because state is not passed in by you, but by setState when it invokes the callback
      6. The `apply` fn returns a new object with the provided `key` as it's only key, the value of which is the opposite of the
        current value of that key on the current state object
      
 */

const makeUpdater = (apply) => (...rest) => (state) => {
  return apply(state, ...rest);
}

const makeUpdaterWithProps = (apply) => (...rest) => (state, props) => {
  return apply(state, props, ...rest);
}

// examples:

// usage: this.setState(toggleKey('clicked'));
export const toggleKey = makeUpdater(
  (prevState, key) => ({ [key]: !prevState[key], })
);

// usage: this.setState(incrementKeyByProp('counter', 'step'));
export const incrementKeyByProp = makeUpdaterWithProps(
  (prevState, props, key, prop) => ({ [key]: prevState[key] + props[prop], })
);

// usage:
  // this.setState(concatKey('classList', 'text-success'));
  // this.setState(concatKey('items', newItem));
  // this.setState(concatKey('items', [1, 2, 3]));
  // this.setState(concatKey('items', [[1, 2, 3]]));
export const concatKey = makeUpdater(
  (prevState, key, add) => ({ [key]: prevState[key].concat(add), })
);

// usage:
  // this.setState(spliceKey('users', 0, 1, [{name: 'neil'}, {name: 'ryan'}]));
  // this.setState(spliceKey('users', prevArr => prevArr.findIndex(user => user.name === 'ryan'), 1));
export const spliceKey = makeUpdater((prevState, key, startIdx, delCnt, insertItems = [], ignoreNegativeOne = true) => {

  const newArr = prevState[key].slice();

  let idx = typeof (startIdx) === 'function' ? startIdx(newArr) : startIdx;

  if (ignoreNegativeOne && idx === -1)
    return newArr;
  else
    newArr.splice(idx, delCnt, ...insertItems);

  return { [key]: newArr, };
});