import { typeOf } from "../helpers/methods";

function extend(item: object[]) {
  const res = {};
  const insert = function (obj) {
    for (let key in obj) {
      let check = obj.hasOwnProperty(key) && typeOf(obj[key], "object");
      res[key] = check ? extend([res[key], obj[key]]) : obj[key];
    }
  };
  Array.isArray(item) ? item.forEach(insert) : insert(item);
  return res;
}

export function merge(...item: object[]) {
  return extend(flatten(item));
}

function assign([name, value]: [name: string, value: any]) {
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
}

export function unflatten(item: object) {
  return merge(Object.entries(item).map(assign));
}

function deflate(
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
}

function dissolve(list, depth = Infinity, level = 1) {
  return list.reduce((acc, item) => {
    let arr = Array.isArray(item) && level < depth;
    return acc.concat(arr ? dissolve(item, depth, ++level) : item);
  }, []);
}

export function flatten(item, token?) {
  return Array.isArray(item) ? dissolve(item, token) : deflate(item, token);
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
