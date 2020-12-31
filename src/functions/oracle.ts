import { del, has, get, set, paths, forEach, map, reduce, walk, moonWalk, spread, sortKeys } from "./object";
import reset from "./reset";
import { typeOf, isObject } from "../helpers/methods";
import {
  flatten,
  unflatten,
  merge,
  hydrate
} from "./flat";
import inspect from "./inspect";

type Path = string | Array<string>;
type callback = (value, key?: Array<string>, object?: object) => any;

interface Agbawo {
  del: () => object;
  has: (path: Path) => boolean;
  get: (path: Path) => any;
  set: (path: Path, value: any) => object;
  forEach: (callbackFn?: callback) => void;
  map: (callbackFn?: callback) => void;
  reduce: (
    callbackFn?: (
      previousValue: any,
      currentValue: any,
      currentPath: Array<string>,
      object: object
    ) => any,
    initialValue?: Object
  ) => any;
  walk: (callbackFn?: callback, depth?: number) => void;
  moonWalk: (callbackFn?: callback, depth?: number) => void;
  spread: (symbol?: string, depth?: number) => object;
  sortKeys: () => object;
  paths: () => Array<string[]>;
  value: () => object;
}

export const oracle = (object: object): Agbawo => ({
  del() {
    return del(object)
  },
  has(path) {
    return has(object, path);
  },
  get(path) {
    return get(object, path);
  },
  set(path, value) {
    return set(object, path, value);
  },
  paths() {
    return paths(object);
  },
  forEach(callbackFn) {
    return forEach(object, callbackFn);
  },
  map(callbackFn) {
    return map(object, callbackFn);
  },
  reduce(callbackFn, initialValue) {
    return reduce(object, callbackFn, initialValue)
  },
  walk(callbackFn, depth) {
    return walk(object, callbackFn, depth);
  },
  moonWalk(callbackFn, depth) {
    return moonWalk(object, callbackFn, depth);
  },
  spread(symbol, depth) {
    return spread(object, symbol, depth);
  },
  sortKeys() {
    return sortKeys(object);
  },
  value() {
    return object;
  },
});

const obj = {
  a: {
    d: {
      f: 2,
      e: 1,
    },
    c: ["f", "e"],
    b: "d",
  },
};