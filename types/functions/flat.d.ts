export declare function merge(object: any, ...item: object[]): {};
export declare function unflatten(item: object): any;
/**
 * @description flattens an object into a daisy-chain with dots
 * @example
 * //→ { "a.b.c.d": "e" }
 * flatten({ a: { b: { c: { d: "e" } } } }, ".");
 * ---
 * @description flattens an array, infinitely or to a depth level
 * @example
 * //→ [ 1, 2, 3, [ 4, [ 5 ] ] ]
 * flatten([1, [2, [3, [4, [5]]]]], 2);
 */
export declare function flatten(item: any, token?: any): any;
export declare function hydrate(item: string): {};
