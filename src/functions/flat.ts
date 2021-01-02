import { typeOf, extend, dissolve, deflate } from "../helpers/methods";
import { Path } from "./wrapper";

export function merge(object, ...item: object[]) {
  return extend(flatten([object, item]));
}

export const toPath = function (path: Path) {
  const str = (e) => e.toString().split(".");
  return Array.isArray(path) ? flatten(path.map(str)) : path.split(".");
};

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

export function unflatten(item: object) {
  return merge(Object.entries(item).map(assign));
}

export function flatten(item: (Array<any> | object), token?: (string | number)) {
  return Array.isArray(item) ? dissolve(item, <number>token) : deflate(item, <string>token);
}

export function hydrate(item: string) {
  const sym = (symbol: string) => new RegExp(`\\s*${symbol}\\s*`);
  const colon = (item: string) => {
    let [name, ...value] = item.split(sym(":"));
    return [name, value.join(": ")];
  };
  const semi = (item: string) => item.split(sym(";")).filter(Boolean);
  return merge(semi(item.trim()).map(colon).map(assign));
}
