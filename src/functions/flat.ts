import { hydrate, type, filter } from "../helpers/methods";

export const merge = (...items: object[]) => {
  const res = {};
  items.forEach((obj) => {
    for (let key in obj) {
      let check = obj.hasOwnProperty(key) && type(obj[key], "Object");
      res[key] = check ? merge(res[key], obj[key]) : obj[key];
    }
  });
  return res;
};

export const unflatten = (item: object) =>
  merge(...Object.entries(item).map(hydrate));

export const flatten = (obj: object, parent?: string | object, res = {}) => {
  for (let key in obj) {
    let propName = parent ? parent + "." + key : key;
    if (type(obj[key], "Object")) flatten(obj[key], propName, res);
    else res[propName] = obj[key];
  }
  return res;
};

export const deflate = (list, depth = Infinity, level = 1) => {
  return list.reduce((acc, item) => {
    let arr = Array.isArray(item) && level < depth;
    return acc.concat(arr ? deflate(item, depth, ++level) : item);
  }, []);
};

export const spread = function (item) {
  const regex = (symbol: string) => new RegExp(`\\s*${symbol}\\s*`);
  const colon = (item: string) => item.split(regex(":"));
  const semi = (item: string) => item.split(regex(";")).filter(Boolean);
  return semi(item.trim()).map(colon).map(hydrate);
};

export const combine = (...list: (string | object)[]) => {
  let sequence = filter(list, "Object");
  let series = deflate(filter(list, "String").map(spread));
  return merge(...sequence.map(unflatten).concat(series));
};
