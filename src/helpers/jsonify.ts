export {};

import {
  isSpecial,
  isSpecialLiteral,
  trimSpecialChar,
  escapeSpecialChar,
} from "./retrocycle";

const reStr = (re) => `/${re.source}/${/\w+$/.exec(re) || ""}`;
export const trim = (value) => value.replace(/"/g, "").substring(4);
export const fnStr = (fn) => (fn.name ? fn.name + "=" : "") + fn;

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
    if (key) if (value instanceof RegExp) return "_re_" + reStr(value);
    if (value instanceof Function) return "_fn_" + fnStr(value);
    if (typeof value === "symbol") return "_sm_" + value.toString();
    if (value.constructor.name === "Object") {
      Reflect.ownKeys(value).forEach((key) => {
        if (typeof key === "symbol") {
          value["_sm_" + key.toString()] = value[key];
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
      if (value.startsWith("_fn_") || value.startsWith("_re_"))
        return new Function(`return ${trim(value)}`)();
      if (value.startsWith("_sm_"))
        return Symbol.for(`${/\((\w+)\)/.exec(trim(value))[1]}`);
      return value;
    };
    return JSON.parse(str, reviver || revive);
  } catch (err) {
    console.log(err)
  }
}
