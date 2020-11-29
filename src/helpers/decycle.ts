export {};

import { specialChar, shouldPassThrough, escapeSpecialChar } from "./methods";
import Epicycle from "./epicycle";

export default function (base) {
  let legend = [];
  let epicycle = new Epicycle();
  let walk = function (current, path) {
    let modified = current;
    if (!shouldPassThrough(current)) {
      if (epicycle.has(current)) {
        if (epicycle.get(current) instanceof Array) {
          legend.push(epicycle.get(current));
          epicycle.set(current, String(specialChar + (legend.length - 1)));
        }
        modified = epicycle.get(current);
      } else {
        epicycle.set(current, path);
        modified = Reflect.ownKeys(current).reduce(
          function (obj, sub) {
            obj[sub] = walk(current[sub], path.concat(sub));
            return obj;
          },
          current instanceof Array ? [] : {}
        );
      }
    }
    if (typeof current === "string")
      modified = escapeSpecialChar(current);
    return modified;
  };
  return {
    legend: legend,
    main: walk(base, []),
  };
};
