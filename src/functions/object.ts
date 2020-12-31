import { typeOf } from "../helpers/methods";
import { flatten, merge, unflatten } from "./flat";

type key = string | (number | string)[];

function split(path: string) {
  const str = (e) => e.toString().split('.')
  return Array.isArray(path) ? flatten(path.map(str)) : path.split(".");
}

function inner(
  object,
  symbol,
  depth = Infinity,
  parent?: string,
  result = {},
  level = 1
) {
  for (let key in object) {
    let propName = parent ? parent + symbol + key : key;
    result[propName] = object[key];
    if (typeOf(object[key], "object") && level < depth)
      inner(object[key], symbol, depth, propName, result, ++level);
  }
  return result;
}

function sizeOf(word: string, letter?: string | RegExp) {
  return word.split("").filter((e) => e.match(letter ?? e)).length;
}

export function del(
  object,
  opts: {
    clear?: boolean;
    remove?: key;
    retain?: key;
  } = {}
) {
  opts = { remove: [], retain: [], ...opts };
  let clear = opts.remove?.length ? false : true;
  Object.keys(spread(object))
    .forEach(function (path) {
      if (opts.retain.includes(path)) return;
      if (clear || opts.remove.includes(path)) delete object[path];
    });
  return object;
}

console.log(del({ a: { b: [2, 3] } }, { remove: "a.b" }))

export function spread(object, symbol = ".", depth?) {
  return inner(object, symbol, depth);
}

export function get(object, path) {
  return split(path).reduce((acc, curr) => acc[curr], object);
}

export function set(object, path, value) {
  return split(path).reduce(function (acc, key, index) {
    return split(path).length == index + 1
      ? (acc[key] = value, object)
      : acc[key]
  }, object)
}

export function walk(
  object,
  callbackFn,
  depth = Infinity
) {
  Object.entries(spread(object)).forEach(function ([key, value]) {
    if (sizeOf(key) < depth) callbackFn(value, split(key), object);
  });
}

export function moonWalk(
  object,
  callbackFn,
  depth = Infinity
) {
  Object.entries(spread(object))
    .reverse()
    .forEach(function ([key, value]) {
      if (sizeOf(key) < depth) callbackFn(value, split(key), object);
    });
}

export function sortKeys(object) {
  return unflatten(
    Object.entries(flatten(object))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .reduce((acc, curr) => ((acc[curr[0]] = curr[1]), acc), {})
  );
}

export function forEach(object, callbackFn) {
  Object.entries(object).forEach(([key, value]) =>
    callbackFn(value, split(key), object)
  );
}

export function map(object, callbackFn) {
  Object.entries(object).forEach(function ([key, value]) {
    return set(object, key, callbackFn(value, split(key), object));
  });
  return object;
}

export function reduce(object, callbackFn, initialValue) {
  return Object.entries(spread(object)).reduce(function (acc, [key, value]) {
    return callbackFn(acc, value, split(key), object)
  }, initialValue)
}

export function paths(object) {
  return Object.keys(spread(object)).map(split);
}

export function has(object, path) {
  return Reflect.ownKeys(Object.getPrototypeOf(object))
    .concat(Object.keys(spread(object)))
    .includes(path);
}