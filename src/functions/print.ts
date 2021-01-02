import { typeOf } from "../helpers/methods";

const toString = function (node) {
  switch (typeOf(node)) {
    case "undefined":
      return "undefined";
    case "function":
      return node.toString() || "[Function]";
    case "boolean":
      return node ? "true" : "false";
    case "bigint":
      return String(node) + "n";
    case "number":
      return String(node);
    case "symbol":
      return node.toString();
    default:
      return node
  }
};

export default function print(object: object, indent = 3) {
  if (typeof object !== "object") return object;
  let replacer = (key, value) => toString(value);
  if (typeof JSON === "undefined") return object;
  return JSON.stringify(object, replacer, indent);
}
