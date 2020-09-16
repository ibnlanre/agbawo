import cyclone from "./cyclone";
import decycle from "./decycle";
import recycle from "./recycle";

import { generateReviver, generateReplacer, stringify, parse } from "./jsonify";
import { walker } from "./oracle";

const Agbawo = {
  walker,
  clone: cyclone,
  stringify: function (value, replacer, space) {
    const master = decycle(value);
    const legend = stringify(master.legend);
    const main = stringify(master.main, generateReplacer(replacer), space);
    return main !== undefined ? `{"legend":${legend},"main":${main}}` : main;
  },
  parse: function (text, reviver) {
    return recycle(parse(text, generateReviver(reviver)));
  },
};

export default Agbawo;
