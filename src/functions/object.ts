import { fnStr, stringify } from "../helpers/jsonify";
import { count, relay, split, trace, typeOf } from "../helpers/methods";
import { flatten, unflatten } from "./flat";
import type { callback, Path } from "./oracle";

export function spread(object: object, symbol = ".", depth?: number): object {
  return relay(object, symbol, depth);
}

export function get(object: object, path: Path): object {
  return split(path).reduce((acc, curr) => acc[curr], object);
}

export function set(object: object, path: Path, value: any) {
  return trace(object, path, (acc, key) => (acc[key] = value));
}

export function update(
  object: object,
  path: Path,
  callbackFn: (value) => any
): object {
  const place = (acc, key) => (acc[key] = callbackFn(acc[key]));
  return trace(object, path, place);
}

export function del(object: object, ...paths: Array<Path>): object {
  flatten(paths).forEach(function (path) {
    trace(object, path, (acc, key) => delete acc[key]);
  });
  return object;
}

export function walk(
  object: object,
  callbackFn: callback,
  depth = Infinity
): void {
  Object.entries(spread(object)).forEach(function ([key, value]) {
    if (count(key) < depth) callbackFn(value, split(key), object);
  });
}

export function moonWalk(
  object: object,
  callbackFn: callback,
  depth = Infinity
): void {
  Object.entries(spread(object))
    .reverse()
    .forEach(function ([key, value]) {
      if (count(key) < depth) callbackFn(value, split(key), object);
    });
}

export function sortKeys(object: object): object {
  return unflatten(
    Object.entries(flatten(object))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .reduce((acc, curr) => ((acc[curr[0]] = curr[1]), acc), {})
  );
}

export function forEach(object: object, callbackFn: callback): void {
  Object.entries(object).forEach(([key, value]) =>
    callbackFn(value, split(key), object)
  );
}

export function map(object: object, callbackFn: callback): object {
  Object.entries(object).forEach(function ([key, value]) {
    return set(object, key, callbackFn(value, split(key), object));
  });
  return object;
}

export function reduce(
  object: object,
  callbackFn: (
    previousValue: any,
    currentValue: any,
    currentPath: Array<string>,
    object: object
  ) => any,
  initialValue?: Object
): Object {
  return Object.entries(spread(object)).reduce(function (acc, [key, value]) {
    return callbackFn(acc, value, split(key), object);
  }, initialValue);
}

export function paths(object: object): Array<string[]> {
  return Object.keys(spread(object)).map(split);
}

export function has(object: object, path: Path): boolean {
  return Reflect.ownKeys(Object.getPrototypeOf(object))
    .concat(Object.keys(spread(object)))
    .includes(Array.isArray(path) ? path.join(".") : path);
}

export function reset(object: object, insert?: object) {
  let induce = (acc, [name, value]) => ((acc[name] = value), acc);
  Object.keys(object).forEach(function (key) {
    delete object[key];
  });
  if (insert) Object.entries(insert).reduce(induce, object);
  return object;
}

let hold = ["root"];
// console.log(walk({ a: { b: 4, c: [1, 2] } }, (value, path) => { hold.push("├" + "") }))

const inspectify = function (node) {
  switch (typeOf(node)) {
    case "function":
      return "Function" + (node.name ? ": " + node.name : "");
    case "boolean":
      return node ? "true" : "false";
    case "bigint":
      return String(node) + "n";
    case "number":
      return String(node);
    case "symbol":
      return "Symbol: " + /(?<=Symbol\()\w+(?=\))/.exec(node.toString()).shift()
    case "regex":
      return ["/", node.source, "/", /\w+$/.exec(node) ?? ""].join('');
    case "set":
    case "weakset":
    case "map":
    case "weakmap":
      return inspectNodes(Array.from(node), typeOf(node));
    case "object":
      return inspectTree(node)
    default: // string
      return node;
  }
};

const inspectValue = function (node) {
  if (!node) return JSON.stringify(node);
  if (typeof node !== "object") return inspectify(node);
  if ("length" in node) return inspectNodes(node);
  return inspectify(node);
};

// ["bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined"]
// ["regexp", "null", "object", "array-like", "error"]

function inspectTree(node: object) {
  return inspectNodes(Object.entries(node).map(function ([key, value]) {
    const values = [value]
    return values
      .reduce(function (result, curr, index) {
        const init = index + 1 < values.length ? "├─ " : "└─ ";
        const prefix = index + 1 < values.length ? "|  " : "   ";
        result.push(init + indent(inspectValue(curr), prefix, true));
        return result;
      },
        [key])
    .join("\n");
    }), "Object")
  }
    // return Object.entries(node).map(([key, value]) => inspectNodes([value], key)).join("/n")
// }

function indent(value, indentation?, ignoreFirst?) {
  if (!value) return value;
  return value
    .split("\n")
    .map(function (node, index) {
      return ignoreFirst && !index ? node : indentation + node;
    })
    .join("\n");
}

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
function inspectNodes(node, type?) {
  return node
    .reduce(
      function (result, curr, index) {
        const init = index + 1 < node.length ? "├─ " : "└─ ";
        const prefix = index + 1 < node.length ? "|  " : "   ";
        result.push(init + indent(inspectValue(curr), prefix, true));
        return result;
      },
      [capitalize(type ?? typeOf(node))]
    )
    .join("\n");
}

function ansiColor(open, close) {
  return function(value) {
    return ["\u001B[", open, "m", value, "\u001B[", close, "m"].join("");
  };  
}

const color = {
  bold: ansiColor(1, 22),
  dim: ansiColor(2, 22),
  green: ansiColor(32, 39),
  yellow: ansiColor(33, 39),
};