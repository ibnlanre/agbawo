import { merge } from "./flat";
import { has, get, set, update } from "./mdoify";
import { forEach, map, reduce } from "./mdoify"
import { walk, moonWalk } from "./mdoify";
import { paths, spread, sortKeys } from "./mdoify";
import { del, reset } from "./mdoify"

export type Path = string | Array<string>;
export type callback = (value, path?: Array<string>, object?: object) => any;

interface Agbawo {
  lastResult: any;
  lastInput: object;
  lastThis: Vet;
}

interface Vet {
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
}

export default function oracle(object: object): Agbawo {
  let lastResult = undefined;
  let lastInput = object;
  let lastThis = {
    has(path) {
      lastResult = has(object, path)
      return this;
    },
    get(path) {
      lastResult = get(object, path);
      return this;
    },
    set(path, value) {
      lastResult = set(object, path, value);
      return this;
    },
    update(path, callbackFn) {
      lastResult = update(object, path, callbackFn);
      return this
    },
    del(paths) {
      lastResult = del(object, ...paths);
      return this;
    },
    reset(insert) {
      lastResult = reset(object, insert);
      return this;
    },
    forEach(callbackFn) {
      lastResult = forEach(object, callbackFn);
      return this;
    },
    map(callbackFn) {
      lastResult = map(object, callbackFn);
      return this;
    },
    reduce(callbackFn, initialValue) {
      lastResult = reduce(object, callbackFn, initialValue);
      return this;
    },
    walk(callbackFn, depth) {
      lastResult = walk(object, callbackFn, depth);
      return this;
    },
    moonWalk(callbackFn, depth) {
      lastResult = moonWalk(object, callbackFn, depth);
      return this;
    },
    paths() {
      lastResult = paths(object);
      return this;
    },
    merge(...items) {
      lastResult = merge(object, ...items);
      return this;
    },
    spread(symbol, depth) {
      lastResult = spread(object, symbol, depth);
      return this;
    },
    sortKeys() {
      lastResult = sortKeys(object);
      return this;
    },
  }
  return {
    lastResult,
    lastInput,
    lastThis
  }
}

