import clone from "./functions/clone";
import stringify from "./functions/stringify";
import parse from "./functions/parse";
import memoize from "./functions/memoize";
import { count, sizeOf, typeOf, isObject } from "./helpers/methods";
import { has, get, set } from "./functions/object";
import { forEach, map, reduce } from "./functions/object";
import { walk, moonWalk } from "./functions/object";
import { paths, spread, sortKeys } from "./functions/object";
import { del, reset } from "./functions/object";
import {
  flatten,
  unflatten,
  merge,
  hydrate
} from "./functions/flat";
import inspect from "./functions/inspect";
import oracle from "./functions/oracle";

export default {
  clone,
  stringify,
  parse,
  inspect,
  typeOf,
  isObject,
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
   * @description deep-extends an object recursively
   * @example
   * //→ { margin: { top: "mt-2", bottom: "mb-2" } }
   * merge([{ margin: { top: "mt-2" } }, { margin: { bottom: "mb-2" } }])
   */
  merge,
  /**
   * @description converts the read-once object syntax into a JS object
   * @example
   * //→ { margin: { top: 'mt-3', bottom: 'mb-1', x: 'ml-2 mr-4' } }
   * hydrate("margin: { top: mt-3, bottom: mb-1 }; margin.x: ml-2 mr-4")
   */
  hydrate,
  /**
   * @description replaces an object's items without changing the reference
   * @example
   * let  = { x: 1, y: 2, z: 3 };
   *
   * //→ { x: 1, z: 3, v: 5, w: 2 }
   * reset(u, { clear: false, retain: ["x"], add: { v: 5 } });
   */ 
  reset,
};
