declare function memoize(passedFn: any, isEqual?: (newInputs: any, lastInputs: any) => boolean): (this: unknown, ...newArgs: unknown[]) => any;
export default memoize;
