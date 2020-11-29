import decycle from "../helpers/decycle";
import { generateReplacer, stringify } from "../helpers/jsonify";

export default function (value, replacer?, space?) {
  const master = decycle(value);
  const legend = stringify(master.legend);
  const main = stringify(master.main, generateReplacer(replacer), space);
  return main !== undefined ? `{"legend":${legend},"main":${main}}` : main;
};