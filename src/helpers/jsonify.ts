export {};

import {
  isSpecial,
  isSpecialLiteral,
  trimSpecialChar,
  escapeSpecialChar,
} from "./special";

const reStr = (re) => "/" + re.source + "/" + /\w+$/.exec(<string>re) || "";
export const trim = (value: string) => value.replace(/"/g, "").substring(4);
export const fnStr = (fn: Function) => (fn.name ? fn.name + "=" : "") + fn;

export const generateReplacer = function (replacer) {
  if (typeof replacer !== "function") {
    return replacer;
  }
  return function (key, value) {
    if (isSpecialLiteral(value)) {
      return escapeSpecialChar(replacer(key, trimSpecialChar(value)));
    }
    return isSpecial(value) ? value : replacer(key, value);
  };
};

export const generateReviver = function (reviver) {
  if (typeof reviver !== "function") {
    return reviver;
  }
  return function (key, value) {
    if (isSpecialLiteral(value)) {
      return escapeSpecialChar(reviver(key, trimSpecialChar(value)));
    }
    return isSpecial(value) ? value : reviver(key, value);
  };
};

export function stringify(obj, replacer?, space?) {
  const inplace = (key, value) => {
    if (!value) return value;
    if (key) if (value instanceof RegExp) return "__re_" + reStr(value);
    if (value instanceof Function) return "__fn_" + fnStr(value);
    if (typeof value === "symbol") return "__sm_" + value.toString();
    if (value.constructor.name === "Object") {
      Reflect.ownKeys(value).forEach((key) => {
        if (typeof key === "symbol") {
          value["__sm_" + key.toString()] = value[key];
        }
      });
    }
    return value;
  };
  return JSON.stringify(obj, replacer || inplace, space);
}

export function parse(str, reviver?) {
  let iso8061 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
  try {
    const revive = function (key, value) {
      if (typeof value != "string") return value;
      if (value.match(iso8061)) return new Date(value);
      if (value.startsWith("__fn_") || value.startsWith("__re_"))
        return new Function(`return ${trim(value)}`)();
      if (value.startsWith("__sm_"))
        return Symbol.for(`${/\((\w+)\)/.exec(trim(value))[1]}`);
      return value;
    };
    return JSON.parse(str, reviver || revive);
  } catch (err) {
    console.log(err)
  }
}
