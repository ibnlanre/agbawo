import clone from "./functions/clone";
import stringify from "./functions/stringify";
import parse from "./functions/parse";
import memoize from "./functions/memoize";
import { charCount, getRef, sizeOf, typeOf, isObject } from "./helpers/methods";
import { has, get, set } from "./functions/modify";
import { forEach, map, reduce } from "./functions/modify";
import { walk, moonWalk } from "./functions/modify";
import { paths, spread, sortKeys } from "./functions/modify";
import { del, reset, update } from "./functions/modify";
import {
  flatten,
  toPath, 
  unflatten,
  merge,
  hydrate
} from "./functions/flat";
import inspect from "./functions/inspect";
import print from "./functions/print";
import wrap from "./functions/wrapper";

export default {
  clone,
  stringify,
  parse,
  print,
  inspect,
  memoize,
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
  flatten,
  /**
   * @description unflattens an object back to its nested form
   * @example
   * //→ { a: { b: { c: { d: "e" } } } }
   * unflatten({ "a.b.c.d": "e" });
   */
  unflatten,
  /**
   * @description Deep-extends an object recursively.
   * @example
   * //→ { margin: { top: "mt-2", bottom: "mb-2" } }
   * merge([{ margin: { top: "mt-2" } }, { margin: { bottom: "mb-2" } }])
   */
  merge,
  /**
   * @description Converts the read-once object syntax into a JS object.
   * @param item The value is a string in the form of a read-once object.
   * @example
   * //→ { margin: { top: 'mt-3', bottom: 'mb-1', x: 'ml-2 mr-4' } }
   * hydrate("margin: { top: mt-3, bottom: mb-1 }; margin.x: ml-2 mr-4")
   */
  hydrate,
  /**
   * @description Replaces an object's items without changing the reference.
   */
  reset,
  has,
  get,
  set,
  /**
   * @description Performs the specified action for each node of an object.
   * @param object The object the perform the function on.
   * @param callbackFn A function that accepts up to three arguments. forEach calls the callbackFn function one time for each node in the object.
   * @param thisArg An object to which the this keyword can refer in the callbackFn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach,
  /**
   * @description Performs the specified action for each node of an object.
   * @param object The object the perform the function on.
   * @param callbackFn Calls a defined callback function on each node of the object, and returns an object that contains the results.
   * @param thisArg An object to which the this keyword can refer in the callbackFn function. If thisArg is omitted, undefined is used as the this value.
   */
  map,
  /**
   * @description Calls the specified callback function for all the nodes of an object. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackFn — A function that accepts up to four arguments. The reduce method calls the callbackFn function one time for each node of the object.
   * @param initialValue — If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackFn function provides this value as an argument instead of an object value.
   */
  reduce,
  walk,
  moonWalk,
  paths,
  spread,
  sortKeys,
  del,
  update,
  wrap,
  util: {
    charCount,
    getRef,
    isObject,
    sizeOf,
    toPath,
    typeOf,
  },
};
