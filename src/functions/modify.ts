import { charCount, relay } from "../helpers/methods";
import { flatten, unflatten, toPath, trace } from "./flat";
import type { callback, Path } from "./wrapper";

export function spread(object: object, symbol = ".", depth?: number): object {
  return relay(object, symbol, depth);
}

export function get(object: object, path: Path): object {
  return toPath(path).reduce((acc, curr) => acc[curr], object);
}

export function set(object: object, path: Path, value: any) {
  return trace(object, path, (acc, key) => (acc[key] = value));
}

export function update(
  object: object,
  path: Path,
  callbackFn: (value, key, object) => any,
  thisArg?: any
): object {
  const place = (acc, key) => callbackFn.apply(thisArg, [acc[key], key, object]);
  return trace(object, path, place);
}

export function del(object: object, ...paths: Array<Path>): object {
  flatten(paths).forEach(function (path) {
    const modifier = (acc, key) =>
      Array.isArray(acc) ? acc.splice(key, 1) : delete acc[key];
    trace(object, path, modifier);
  });
  return object;
}

export function walk(
  object: object,
  callbackFn?: callback,
  depth = Infinity
): void {
  Object.entries(spread(object)).forEach(function ([key, value]) {
    if (charCount(key, /\w/) <= depth) callbackFn(value, toPath(key), object);
  });
}

export function moonWalk(
  object: object,
  callbackFn?: callback,
  depth = Infinity
): void {
  Object.entries(spread(object))
    .reverse()
    .forEach(function ([key, value]) {
      if (charCount(key, /w/) <= depth) callbackFn(value, toPath(key), object);
    });
}

export function sortKeys(object: object): object {
  return unflatten(
    Object.entries(flatten(object))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .reduce((acc, curr) => ((acc[curr[0]] = curr[1]), acc), {})
  );
}

export function forEach(object: object, callbackFn: callback, thisArg?: any): void {
  Object.entries(object).forEach(([key, value]) =>
    callbackFn.apply(thisArg, [value, toPath(key), object])
  );
}

export function map(object: object, callbackFn: callback, thisArg?: any): object {
  Object.entries(object).forEach(function ([key, value]) {
    return set(object, key, callbackFn.apply(thisArg, [value, toPath(key), object]));
  });
  return object;
}

export function reduce(
  object: object,
  callbackFn: (
    previousValue: any,
    currentValue: any,
    currentPath?: Array<string>,
    object?: object
  ) => any,
  initialValue?: Object
): Object {
  return Object.entries(spread(object)).reduce(function (acc, [key, value]) {
    return callbackFn(acc, value, toPath(key), object);
  }, initialValue);
}

export function paths(object: object): Array<string[]> {
  return Object.keys(spread(object)).map(toPath);
}

export function has(object: object, path: Path): boolean {
  return Reflect.ownKeys(Object.getPrototypeOf(object))
    .concat(Object.keys(spread(object)))
    .includes(Array.isArray(path) ? path.join(".") : path);
}

export function reset(object: object, insert?: object) {
  let induce = (acc, [name, value]) => ((acc[name] = value), acc);
  Object.keys(object).forEach(function (key) {
    delete object[key];
  });
  if (insert) Object.entries(insert).reduce(induce, object);
  return object;
}
