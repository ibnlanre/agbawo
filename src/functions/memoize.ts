export default function (passedFn) {
  let lastThis: unknown;
  let lastArgs: unknown[] = [];
  let lastResult;
  let calledOnce: boolean = false;

  const isEqual = (newInputs, lastInputs): boolean => {
    if (newInputs.length !== lastInputs.length) return false;
    for (let i = 0; i < newInputs.length; i++)
      if (newInputs[i] !== lastInputs[i]) return false;
    return true;
  };

  function memo(this: unknown, ...newArgs: unknown[]) {
    const called = calledOnce && lastThis === this;
    if (called && isEqual(newArgs, lastArgs)) return lastResult;
    lastResult = passedFn.apply(this, newArgs);
    [calledOnce, lastThis, lastArgs] = [true, this, newArgs];
    return lastResult;
  }

  return memo;
};
