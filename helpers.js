// Idea from the last code snippet in https://medium.freecodecamp.org/get-pro-with-react-setstate-in-10-minutes-d38251d1c781
  // Original:
    // const makeUpdater = apply => key => state => ({ [key]: apply(state[key]), });
      /* 
        Not as flexible as below versions. Can only be used to change one key.
        Doesn't allow for:
          - additional parameters for more complex updaters to be made
          - adding new keys and/or changing multiple keys together
      */ 

const makeUpdater = apply => (...rest) => state => {
  return apply(state, ...rest);
}

const makeUpdaterWithProps = apply => (...rest) => (state, props) => {
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