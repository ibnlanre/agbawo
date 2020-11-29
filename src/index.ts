import clone from "./functions/clone";
import stringify from "./functions/stringify";
import parse from "./functions/parse";
import memoize from "./functions/memoize";
import restock from "./functions/restock";
import {
  flatten,
  unflatten,
  deflate,
  merge,
  spread,
  combine,
} from "./functions/flat";
import inspect from "./functions/inspect";

export default {
  clone,
  stringify,
  parse,
  inspect,
  /**
   * @description replaces an object's items without changing the reference
   * @example
   * //→ { 'colors.purple': 'bg-purple-500' }
   * memoize({ color: "pink" }, { "colors.purple": "bg-purple-500" })
   */
  memoize,
  /**
   * @description flattens an object separating its key with dots
   * @example
   * //→ { 'key3.a.b.c': 2 }
   * flatten({ key3: { a: { b: { c: 2 } } } });
   */
  flatten,
  /**
   * @description unflattens an object back to its nested form
   * @example
   * //→ { "user": { "key_value_map": { "CreatedDate": "123424" } } }
   * unflatten({ 'user.key_value_map.CreatedDate': '123424' });
   */
  unflatten,
  /**
   * @description flattens an array, infinitely or to a depth level
   * @example
   * //→ [ 1, 2, 3, [ 4, [ 5 ] ] ]
   * deflate([1, [2, [3, [4, [5]]]]], 2)
   */
  deflate,
  /**
   * @description deep-extends an object recursively
   * @example
   * //→ { margin: { top: "mt-2", bottom: "mb-2" } }
   * merge({ margin: { top: "mt-2" }, { margin: { bottom: "mb-2" } })
   */
  merge,
  /**
   * @description disintegrates the css object syntax into js objects
   * @example
   * //→ [{ margin: { top: "mt-3" } }, { margin: { bottom: "mb-3" } }]
   * spread("margin.top: mt-3; margin.bottom: mb-3")
   */
  spread,
  /**
   * @description spreads strings, unflattens objects, then combines
   * @example
   * //→ { colors: { purple: 'bg-purple-500', pink: 'bg-pink-500' } }
   * combine("colors.pink: bg-pink-500", { "colors.purple": "bg-purple-500" })
   */
  combine,
  /**
   * @description replaces an object's items without changing the reference
   * @example
   * //→ { 'colors.purple': 'bg-purple-500' }
   * restock({ color: "pink" }, { "colors.purple": "bg-purple-500" })
   */
  restock,
};
