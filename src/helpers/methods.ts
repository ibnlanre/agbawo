import { flatten, hydrate, merge, unflatten } from "../functions/flat";
import { Path } from "../functions/oracle";

export const typeOf = function (value, what?: string) {
  let make = value?.constructor.name.toLowerCase()
  let type = !value ? typeof value : make;
  return what ? type === what : type;
};

export const isObject = function (value: any) {
  return typeOf(value, "object");
};

export const toPath = function (path: Path) {
  const str = (e) => e.toString().split(".");
  return Array.isArray(path) ? flatten(path.map(str)) : path.split(".");
};

export const relay = function (
  object: object,
  symbol: string,
  depth = Infinity,
  parent?: string,
  result = {},
  level = 1
) {
  for (let key in object) {
    let propName = parent ? parent + symbol + key : key;
    result[propName] = object[key];
    if (typeOf(object[key], "object") && level < depth)
      relay(object[key], symbol, depth, propName, result, ++level);
  }
  return result;
};

export const charCount = function (word: string, char?: string | RegExp) {
  return word.split("").filter((e) => e.match(char ?? e)).length;
};

export const sizeOf = function (object: Object) {
  return Array.isArray(object) ? object.length : Object.keys(object).length;
}

export const trace = function (
  object: object,
  path: Path,
  callback?: (Object, string) => any
): object {
  return toPath(path).reduce(function (acc, key, index) {
    return toPath(path).length == index + 1
      ? (callback(acc, key), object)
      : acc[key];
  }, object);
};

export const assign = function ([name, value]: [name: string, value: any]) {
  function handleString(set) {
    set = /(?<={).*(?=})/.exec(set)?.shift() ?? set;
    return merge(set.split(",").map(hydrate));
  }
  function defineChange(set) {
    return typeOf(set, "object")
      ? unflatten(set)
      : typeOf(set, "string") && set.startsWith("{") && set.endsWith("}")
      ? handleString(set)
      : set;
  }
  const callback = (set, curr) => ({ [curr]: defineChange(set) });
  return name.split(/\b\.\b/).reduceRight(callback, value);
};

export const extend = function (item: object[]) {
  const res = {};
  const insert = function (obj) {
    for (let key in obj) {
      let check = obj.hasOwnProperty(key) && typeOf(obj[key], "object");
      res[key] = check ? extend([res[key], obj[key]]) : obj[key];
    }
  };
  Array.isArray(item) ? item.forEach(insert) : insert(item);
  return res;
};

export const deflate = function (
  obj: object,
  symbol?: string,
  parent?: string | object,
  res = {}
) {
  symbol ??= ".";
  for (let key in obj) {
    let propName = parent ? parent + symbol + key : key;
    if (typeOf(obj[key], "object")) deflate(obj[key], symbol, propName, res);
    else res[propName] = obj[key];
  }
  return res;
};

export const dissolve = function (list, depth = Infinity, level = 1) {
  return list.reduce((acc, item) => {
    let arr = Array.isArray(item) && level < depth;
    return acc.concat(arr ? dissolve(item, depth, ++level) : item);
  }, []);
};
