import clone from "./functions/clone";
import stringify from "./functions/stringify";
import parse from "./functions/parse";
import memoize from "./functions/memoize";
import reset from "./functions/reset";
import { typeOf, isObject } from "./helpers/methods";
import {
  flatten,
  unflatten,
  merge,
  hydrate
} from "./functions/flat";
import inspect from "./functions/inspect";

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
   * @description inflates the read-once object syntax into js objects
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
