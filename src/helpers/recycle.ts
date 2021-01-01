export {};

import {
  isSpecial,
  isSpecialLiteral,
  shouldPassThrough,
  trimSpecialChar,
} from "./retrocycle";

import { trim } from "./jsonify";

export default function (master) {
  let walk = function (current, key?, parent?) {
    let modified = current;
    let index;
    if (current && current.constructor.name === "Object") {
      Object.keys(current).forEach((key) => {
        if (typeof key === "string" && key.startsWith("_sm_")) {
          modified = master.main;
          modified[Symbol.for(`${/\((\w+)\)/.exec(trim(key))[1]}`)] =
            current[key];
          delete modified[key];
        }
      });
    }
    if (!shouldPassThrough(current)) {
      Reflect.ownKeys(current).forEach(function (sub) {
        return walk(current[sub], sub, current);
      });
    }
    if (isSpecial(current)) {
      modified = master.main;
      index = Number(trimSpecialChar(current));
      master.legend[index].forEach(function (sub) {
        return (modified = modified[sub]);
      });
    }
    if (isSpecialLiteral(current)) {
      modified = trimSpecialChar(current);
    }
    if (parent) {
      parent[key] = modified;
    }
    return modified;
  };

  if (
    typeof master !== "object" ||
    master === null ||
    master.main === undefined ||
    master.legend === undefined ||
    !(master.legend instanceof Array)
  ) {
    return master;
  }

  return walk(master.main);
};
