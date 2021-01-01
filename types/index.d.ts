import clone from "./functions/clone";
import stringify from "./functions/stringify";
import parse from "./functions/parse";
import memoize from "./functions/memoize";
import { reset } from "./functions/object";
import { flatten, unflatten, merge, hydrate } from "./functions/flat";
import inspect from "./functions/inspect";
declare const _default: {
    clone: typeof clone;
    stringify: typeof stringify;
    parse: typeof parse;
    inspect: typeof inspect;
    typeOf: (value: any, what?: string) => any;
    isObject: (value: any) => any;
    memoize: typeof memoize;
    flatten: typeof flatten;
    /**
     * @description unflattens an object back to its nested form
     * @example
     * //→ { a: { b: { c: { d: "e" } } } }
     * unflatten({ "a.b.c.d": "e" });
     */
    unflatten: typeof unflatten;
    /**
     * @description deep-extends an object recursively
     * @example
     * //→ { margin: { top: "mt-2", bottom: "mb-2" } }
     * merge([{ margin: { top: "mt-2" } }, { margin: { bottom: "mb-2" } }])
     */
    merge: typeof merge;
    /**
     * @description converts the read-once object syntax into a JS object
     * @example
     * //→ { margin: { top: 'mt-3', bottom: 'mb-1', x: 'ml-2 mr-4' } }
     * hydrate("margin: { top: mt-3, bottom: mb-1 }; margin.x: ml-2 mr-4")
     */
    hydrate: typeof hydrate;
    /**
     * @description replaces an object's items without changing the reference
     * @example
     * let  = { x: 1, y: 2, z: 3 };
     *
     * //→ { x: 1, z: 3, v: 5, w: 2 }
     * reset(u, { clear: false, retain: ["x"], add: { v: 5 } });
     */
    reset: typeof reset;
};
export default _default;
