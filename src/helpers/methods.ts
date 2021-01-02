import { flatten } from "../functions/flat";
import { Path } from "../functions/wrapper";

export const typeOf = function (value, what?: string) {
  let make = value?.constructor.name.toLowerCase()
  let type = !value ? typeof value : make;
  return what ? type === what : type;
};

export const isObject = function (value: any) {
  return typeOf(value, "object");
};

export const getRef = function (object: object, key: string) {
  return object[key.replace("__ref_", "")]
}

export const relay = function (
  object: object,
  symbol: string,
  depth = Infinity,
  parent?: string,
  result = {},
  level = 1,
  cyclic = new Map()
) {
  for (let key in object) {
    let propName = parent ? parent + symbol + key : key;
    result[propName] = cyclic.get(object[key]) ?? object[key];
    if (typeOf(object[key], "object") && !cyclic.has(object[key]) && level < depth) {
      cyclic.set(object[key], "__ref_" + key);
      relay(object[key], symbol, depth, propName, result, ++level, cyclic);
    }
  }
  return result;
};

export const charCount = function (word: string, char?: string | RegExp) {
  return word.split("").filter((e) => e.match(char ?? e)).length;
};

export const sizeOf = function (object: Object) {
  return Array.isArray(object) ? object.length : Object.keys(object).length;
}

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

export const dissolve = function (list: Array<any>, depth = Infinity, level = 1) {
  return list.reduce((acc, item) => {
    let arr = Array.isArray(item) && level < depth;
    return acc.concat(arr ? dissolve(item, depth, ++level) : item);
  }, []);
};
