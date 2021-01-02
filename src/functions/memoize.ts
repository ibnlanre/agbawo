const areTheyEqual = (newInputs, lastInputs): boolean => {
  if (newInputs.length !== lastInputs.length) return false;
  for (let i = 0; i < newInputs.length; i++)
    if (newInputs[i] !== lastInputs[i]) return false;
  return true;
};

function memoize(passedFn, isEqual = areTheyEqual) {
  let lastThis: unknown;
  let lastArgs: unknown[] = [];
  let lastResult;
  let calledOnce: boolean = false;

  function memo(this: unknown, ...newArgs: unknown[]) {
    const called = calledOnce && lastThis === this;
    if (called && isEqual(newArgs, lastArgs)) return lastResult;
    lastResult = passedFn.apply(this, newArgs);
    [calledOnce, lastThis, lastArgs] = [true, this, newArgs];
    return lastResult;
  }

  return memo;
};

export default memoize;