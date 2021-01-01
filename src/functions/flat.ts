import { extend, assign, dissolve, deflate } from "../helpers/methods";

export function merge(object, ...item: object[]) {
  return extend(flatten([object, item]));
}

export function unflatten(item: object) {
  return merge(Object.entries(item).map(assign));
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
