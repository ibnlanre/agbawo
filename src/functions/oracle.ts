import { merge } from "./flat";
import { has, get, set, update } from "./object";
import { forEach, map, reduce } from "./object"
import { walk, moonWalk } from "./object";
import { paths, spread, sortKeys } from "./object";
import { del, reset } from "./object"

export type Path = string | Array<string>;
export type callback = (value, path?: Array<string>, object?: object) => any;

interface Agbawo {
  has: (path: Path) => boolean;
  get: (path: Path) => any;
  set: (path: Path, value: any) => object;
  update: (path: Path, callbackFn: (value) => any) => object;
  del: (path: Array<Path>) => object;
  reset: (insert: object) => object;
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
  merge: (...items) => object;
  spread: (symbol?: string, depth?: number) => object;
  sortKeys: () => object;
  paths: () => Array<string[]>;
  value: () => object;
}

export default function oracle(object: object): Agbawo {
  return {
    has(path) {
      return has(object, path);
    },
    get(path) {
      return get(object, path);
    },
    set(path, value) {
      return set(object, path, value);
    },
    update(path, callbackFn) {
      return update(object, path, callbackFn)
    },
    del(paths) {
      return del(object, ...paths);
    },
    reset(insert) {
      return reset(object, insert);
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
    paths() {
      return paths(object);
    },
    merge(...items) {
      return merge(object, ...items);
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
  }
}

