import { typeOf } from "../helpers/methods";

function ansiColor(open: number, close: number) {
  return function (value: string) {
    return ["\u001b[", open, "m", value, "\u001b[", close, "m"].join("");
  };
}

const color = {
  bold: ansiColor(1, 22), // null
  dim: ansiColor(2, 22),
  italic: ansiColor(3, 23),
  underline: ansiColor(4, 24),
  inverse: ansiColor(7, 27),
  black: ansiColor(30, 39),
  red: ansiColor(31, 39), // regexp
  green: ansiColor(32, 39), // symbol
  yellow: ansiColor(33, 39), // number, boolean
  blue: ansiColor(34, 39), // not visible in CMD
  magenta: ansiColor(35, 39), // date
  cyan: ansiColor(36, 39), // special
  white: ansiColor(37, 39), // string
  grey: ansiColor(90, 39), // undefined
};

const inspectNonTree = function (node) {
  switch (typeOf(node)) {
    case "undefined":
      return color.grey("undefined")
    case "function":
      let name = (node.name ? color.white(": ") + node.name : "");
      return color.green(capitalize(typeOf(node))) + name;
    case "boolean":
      return color.yellow(node ? "true" : "false");
    case "bigint":
      return color.yellow(String(node)) + "n";
    case "number":
      return color.yellow(String(node));
    case "symbol":
      let symboliic = /(?<=Symbol\()\w+(?=\))/.exec(node.toString())
      return color.green("Symbol") + color.white(": ") + symboliic.shift();
    default:
      return color.white(node);
  }
};

const inspectFields = function (node) {
  if ("length" in node) return inspectNodes(node);
  if (typeOf(node).includes("set") && typeOf(node).includes("map"))
    return inspectNodes(Array.from(node), typeOf(node));
  
  switch (typeOf(node)) {
    case "regex":
      return ["/", node.source, "/", /\w+$/.exec(node) ?? ""].join("");
    case "object":
      return inspectTree(node);
  }
}

function indent(value: string, indentation?: string) {
  return value
    .split("\n")
    .map((node, index) => !index ? node : indentation + node)
    .join("\n");
}

function inspectValue(node) {
  return function (result: string[], curr, index: number) {
    const init =
      index + 1 < node.length ? color.grey("├─ ") : color.grey("└─ ");
    const prefix = index + 1 < node.length ? color.grey("|  ") : "   ";
    result.push(init + indent(inspect(curr), prefix));
    return result;
  }
}

function inspectTree(values: object) {
  return inspectNodes(
    Object.entries(values).map(function ([key, value]) {
      const node = [value];
      return node.reduce(inspectValue(node), [key]).join("\n");
    }),
    "Object"
  );
}

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

function inspectNodes(node: any[], type?: string) {
  return <string>node.reduce(inspectValue(node),
      [color.green(capitalize(type ?? typeOf(node)))]
    )
    .join("\n");
}

function inspect (node) {
  if (node === null) return color.bold("null")
  if (typeof node !== "object") return inspectNonTree(node);
  return inspectFields(node);
};

inspect.noColor = function (node) {
  let colorExpression = /\u001b\[\d{1,3}m/g;
  return inspect(node).replace(colorExpression, "");
}

export default inspect;