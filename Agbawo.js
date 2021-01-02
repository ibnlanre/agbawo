/*!
 * Àgbawo-1.1.0
 * Copyright (c) 2021 Ridwan Olanrewaju.
 * Licensed under the MIT license.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Agbawo = factory());
}(this, (function () { 'use strict';

    var shouldPassThrough = function (value) {
        return (typeof value !== "object" ||
            value === null ||
            typeof value.toJSON === "function" ||
            value instanceof String ||
            value instanceof Number ||
            value instanceof RegExp ||
            value instanceof Date ||
            value instanceof Boolean);
    };
    var specialChar = "~";
    var isSpecialLiteral = function (value) {
        return (typeof value === "string" && value.indexOf(specialChar + specialChar) === 0);
    };
    var isSpecial = function (value) {
        return (typeof value === "string" &&
            value.indexOf(specialChar) === 0 &&
            !isSpecialLiteral(value));
    };
    var escapeSpecialChar = function (value) {
        return isSpecial(value) || isSpecialLiteral(value)
            ? specialChar + value
            : value;
    };
    var trimSpecialChar = function (value) {
        return value.slice(1);
    };

    var reStr = function (re) { return "/" + re.source + "/" + /\w+$/.exec(re) || ""; };
    var trim = function (value) { return value.replace(/"/g, "").substring(4); };
    var fnStr = function (fn) { return (fn.name ? fn.name + "=" : "") + fn; };
    var generateReplacer = function (replacer) {
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
    var generateReviver = function (reviver) {
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
    function stringify(obj, replacer, space) {
        var inplace = function (key, value) {
            if (!value)
                return value;
            if (key)
                if (value instanceof RegExp)
                    return "__re_" + reStr(value);
            if (value instanceof Function)
                return "__fn_" + fnStr(value);
            if (typeof value === "symbol")
                return "__sm_" + value.toString();
            if (value.constructor.name === "Object") {
                Reflect.ownKeys(value).forEach(function (key) {
                    if (typeof key === "symbol") {
                        value["__sm_" + key.toString()] = value[key];
                    }
                });
            }
            return value;
        };
        return JSON.stringify(obj, replacer || inplace, space);
    }
    function parse(str, reviver) {
        var iso8061 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
        try {
            var revive = function (key, value) {
                if (typeof value != "string")
                    return value;
                if (value.match(iso8061))
                    return new Date(value);
                if (value.startsWith("__fn_") || value.startsWith("__re_"))
                    return new Function("return " + trim(value))();
                if (value.startsWith("__sm_"))
                    return Symbol.for("" + /\((\w+)\)/.exec(trim(value))[1]);
                return value;
            };
            return JSON.parse(str, reviver || revive);
        }
        catch (err) {
            console.log(err);
        }
    }

    function reflect(obj, newObj, cyclic) {
        var eachKey = function (key) {
            var descriptor = Object.getOwnPropertyDescriptor(newObj, key);
            if (!(key in newObj) || descriptor.writable) {
                newObj[key] = Array.isArray(obj[key])
                    ? obj[key].map(function (e) { return clone(e, cyclic); })
                    : clone(obj[key], cyclic);
            }
        };
        var proto = Object.getPrototypeOf(obj);
        Reflect.ownKeys(proto)
            .filter(function (key) { return !(key in newObj); })
            .concat(Reflect.ownKeys(obj))
            .forEach(function (key) { return eachKey(key); });
    }
    function clone(obj, cyclic) {
        if (cyclic === void 0) { cyclic = new Map(); }
        try {
            if (cyclic.has(obj))
                return cyclic.get(obj);
            if (!obj || !(obj instanceof Object))
                return obj;
            var newObj = create(obj);
            reflect(obj, newObj, cyclic.set(obj, newObj));
            return newObj;
        }
        catch (_a) {
            return obj;
        }
    }
    var create = function (obj) {
        var value = obj.constructor.name;
        var node = global.Buffer && Buffer.isBuffer(obj);
        var buf = [obj.buffer, obj.byteOffset, obj.length];
        return value === "ArrayBuffer"
            ? obj.slice()
            : value === "Date"
                ? new Date().setTime(obj.getTime())
                : value === "RegExp"
                    ? new RegExp(obj.source, (/\w+$/.exec(obj) || ""))
                    : "buffer" in obj
                        ? (node ? Buffer.from : new obj.constructor()).apply(void 0, buf) : obj instanceof Function
                        ? new Function("return (" + fnStr(obj) + ")")()
                        : new obj.constructor();
    };

    var Epicycle = /** @class */ (function () {
        function Epicycle() {
            this.keys = [];
            this.values = [];
        }
        Epicycle.prototype.get = function (key) {
            var index = this.keys.indexOf(key);
            return this.values[index];
        };
        Epicycle.prototype.has = function (key) {
            return this.keys.indexOf(key) >= 0;
        };
        Epicycle.prototype.set = function (key, value) {
            var index = this.keys.indexOf(key);
            if (index >= 0) {
                this.values[index] = value;
            }
            else {
                this.keys.push(key);
                this.values.push(value);
            }
            return this;
        };
        return Epicycle;
    }());

    function decycle (base) {
        var legend = [];
        var epicycle = new Epicycle();
        var walk = function (current, path) {
            var modified = current;
            if (!shouldPassThrough(current)) {
                if (epicycle.has(current)) {
                    if (epicycle.get(current) instanceof Array) {
                        legend.push(epicycle.get(current));
                        epicycle.set(current, String(specialChar + (legend.length - 1)));
                    }
                    modified = epicycle.get(current);
                }
                else {
                    epicycle.set(current, path);
                    modified = Reflect.ownKeys(current).reduce(function (obj, sub) {
                        obj[sub] = walk(current[sub], path.concat(sub));
                        return obj;
                    }, current instanceof Array ? [] : {});
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
    }

    function stringify$1 (value, replacer, space) {
        var master = decycle(value);
        var legend = stringify(master.legend);
        var main = stringify(master.main, generateReplacer(replacer), space);
        return main !== undefined ? "{\"legend\":" + legend + ",\"main\":" + main + "}" : main;
    }

    function recycle (master) {
        var walk = function (current, key, parent) {
            var modified = current;
            var index;
            if (current && current.constructor.name === "Object") {
                Object.keys(current).forEach(function (key) {
                    if (typeof key === "string" && key.startsWith("_sm_")) {
                        modified = master.main;
                        modified[Symbol.for("" + /\((\w+)\)/.exec(trim(key))[1])] =
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
        if (typeof master !== "object" ||
            master === null ||
            master.main === undefined ||
            master.legend === undefined ||
            !(master.legend instanceof Array)) {
            return master;
        }
        return walk(master.main);
    }

    function parse$1 (text, reviver) {
        return recycle(parse(text, generateReviver(reviver)));
    }

    var areTheyEqual = function (newInputs, lastInputs) {
        if (newInputs.length !== lastInputs.length)
            return false;
        for (var i = 0; i < newInputs.length; i++)
            if (newInputs[i] !== lastInputs[i])
                return false;
        return true;
    };
    function memoize(passedFn, isEqual) {
        if (isEqual === void 0) { isEqual = areTheyEqual; }
        var lastThis;
        var lastArgs = [];
        var lastResult;
        var calledOnce = false;
        function memo() {
            var _a;
            var newArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newArgs[_i] = arguments[_i];
            }
            var called = calledOnce && lastThis === this;
            if (called && isEqual(newArgs, lastArgs))
                return lastResult;
            lastResult = passedFn.apply(this, newArgs);
            _a = [true, this, newArgs], calledOnce = _a[0], lastThis = _a[1], lastArgs = _a[2];
            return lastResult;
        }
        return memo;
    }

    var typeOf = function (value, what) {
        var make = value === null || value === void 0 ? void 0 : value.constructor.name.toLowerCase();
        var type = !value ? typeof value : make;
        return what ? type === what : type;
    };
    var isObject = function (value) {
        return typeOf(value, "object");
    };
    var getRef = function (object, key) {
        return object[key.replace("__ref_", "")];
    };
    var relay = function (object, symbol, depth, parent, result, level, cyclic) {
        var _a;
        if (depth === void 0) { depth = Infinity; }
        if (result === void 0) { result = {}; }
        if (level === void 0) { level = 1; }
        if (cyclic === void 0) { cyclic = new Map(); }
        for (var key in object) {
            var propName = parent ? parent + symbol + key : key;
            result[propName] = (_a = cyclic.get(object[key])) !== null && _a !== void 0 ? _a : object[key];
            if (typeOf(object[key], "object") && !cyclic.has(object[key]) && level < depth) {
                cyclic.set(object[key], "__ref_" + key);
                relay(object[key], symbol, depth, propName, result, ++level, cyclic);
            }
        }
        return result;
    };
    var charCount = function (word, char) {
        return word.split("").filter(function (e) { return e.match(char !== null && char !== void 0 ? char : e); }).length;
    };
    var sizeOf = function (object) {
        return Array.isArray(object) ? object.length : Object.keys(object).length;
    };
    var extend = function (item) {
        var res = {};
        var insert = function (obj) {
            for (var key in obj) {
                var check = obj.hasOwnProperty(key) && typeOf(obj[key], "object");
                res[key] = check ? extend([res[key], obj[key]]) : obj[key];
            }
        };
        Array.isArray(item) ? item.forEach(insert) : insert(item);
        return res;
    };
    var deflate = function (obj, symbol, parent, res) {
        if (res === void 0) { res = {}; }
        symbol !== null && symbol !== void 0 ? symbol : (symbol = ".");
        for (var key in obj) {
            var propName = parent ? parent + symbol + key : key;
            if (typeOf(obj[key], "object"))
                deflate(obj[key], symbol, propName, res);
            else
                res[propName] = obj[key];
        }
        return res;
    };
    var dissolve = function (list, depth, level) {
        if (depth === void 0) { depth = Infinity; }
        if (level === void 0) { level = 1; }
        return list.reduce(function (acc, item) {
            var arr = Array.isArray(item) && level < depth;
            return acc.concat(arr ? dissolve(item, depth, ++level) : item);
        }, []);
    };

    function merge(object) {
        var item = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            item[_i - 1] = arguments[_i];
        }
        return extend(flatten([object, item]));
    }
    var toPath = function (path) {
        var str = function (e) { return e.toString().split("."); };
        return Array.isArray(path) ? flatten(path.map(str)) : path.split(".");
    };
    var trace = function (object, path, callback) {
        return toPath(path).reduce(function (acc, key, index) {
            return toPath(path).length == index + 1
                ? (callback(acc, key), object)
                : acc[key];
        }, object);
    };
    var assign = function (_a) {
        var name = _a[0], value = _a[1];
        function handleString(set) {
            var _a, _b;
            set = (_b = (_a = /(?<={).*(?=})/.exec(set)) === null || _a === void 0 ? void 0 : _a.shift()) !== null && _b !== void 0 ? _b : set;
            return merge(set.split(",").map(hydrate));
        }
        function defineChange(set) {
            return typeOf(set, "object")
                ? unflatten(set)
                : typeOf(set, "string") && set.startsWith("{") && set.endsWith("}")
                    ? handleString(set)
                    : set;
        }
        var callback = function (set, curr) {
            var _a;
            return (_a = {}, _a[curr] = defineChange(set), _a);
        };
        return name.split(/\b\.\b/).reduceRight(callback, value);
    };
    function unflatten(item) {
        return merge(Object.entries(item).map(assign));
    }
    function flatten(item, token) {
        return Array.isArray(item) ? dissolve(item, token) : deflate(item, token);
    }
    function hydrate(item) {
        var sym = function (symbol) { return new RegExp("\\s*" + symbol + "\\s*"); };
        var colon = function (item) {
            var _a = item.split(sym(":")), name = _a[0], value = _a.slice(1);
            return [name, value.join(": ")];
        };
        var semi = function (item) { return item.split(sym(";")).filter(Boolean); };
        return merge(semi(item.trim()).map(colon).map(assign));
    }

    function spread(object, symbol, depth) {
        if (symbol === void 0) { symbol = "."; }
        return relay(object, symbol, depth);
    }
    function get(object, path) {
        return toPath(path).reduce(function (acc, curr) { return acc[curr]; }, object);
    }
    function set(object, path, value) {
        return trace(object, path, function (acc, key) { return (acc[key] = value); });
    }
    function update(object, path, callbackFn, thisArg) {
        var place = function (acc, key) { return callbackFn.apply(thisArg, [acc[key], key, object]); };
        return trace(object, path, place);
    }
    function del(object) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        flatten(paths).forEach(function (path) {
            var modifier = function (acc, key) {
                return Array.isArray(acc) ? acc.splice(key, 1) : delete acc[key];
            };
            trace(object, path, modifier);
        });
        return object;
    }
    function walk(object, callbackFn, depth) {
        if (depth === void 0) { depth = Infinity; }
        Object.entries(spread(object)).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (charCount(key, /\w/) <= depth)
                callbackFn(value, toPath(key), object);
        });
    }
    function moonWalk(object, callbackFn, depth) {
        if (depth === void 0) { depth = Infinity; }
        Object.entries(spread(object))
            .reverse()
            .forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (charCount(key, /w/) <= depth)
                callbackFn(value, toPath(key), object);
        });
    }
    function sortKeys(object) {
        return unflatten(Object.entries(flatten(object))
            .sort(function (a, b) { return a[0].localeCompare(b[0]); })
            .reduce(function (acc, curr) { return ((acc[curr[0]] = curr[1]), acc); }, {}));
    }
    function forEach(object, callbackFn, thisArg) {
        Object.entries(object).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return callbackFn.apply(thisArg, [value, toPath(key), object]);
        });
    }
    function map(object, callbackFn, thisArg) {
        Object.entries(object).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return set(object, key, callbackFn.apply(thisArg, [value, toPath(key), object]));
        });
        return object;
    }
    function reduce(object, callbackFn, initialValue) {
        return Object.entries(spread(object)).reduce(function (acc, _a) {
            var key = _a[0], value = _a[1];
            return callbackFn(acc, value, toPath(key), object);
        }, initialValue);
    }
    function paths(object) {
        return Object.keys(spread(object)).map(toPath);
    }
    function has(object, path) {
        return Reflect.ownKeys(Object.getPrototypeOf(object))
            .concat(Object.keys(spread(object)))
            .includes(Array.isArray(path) ? path.join(".") : path);
    }
    function reset(object, insert) {
        var induce = function (acc, _a) {
            var name = _a[0], value = _a[1];
            return ((acc[name] = value), acc);
        };
        Object.keys(object).forEach(function (key) {
            delete object[key];
        });
        if (insert)
            Object.entries(insert).reduce(induce, object);
        return object;
    }

    function ansiColor(open, close) {
        return function (value) {
            return ["\u001b[", open, "m", value, "\u001b[", close, "m"].join("");
        };
    }
    var color = {
        bold: ansiColor(1, 22),
        dim: ansiColor(2, 22),
        italic: ansiColor(3, 23),
        underline: ansiColor(4, 24),
        inverse: ansiColor(7, 27),
        black: ansiColor(30, 39),
        red: ansiColor(31, 39),
        green: ansiColor(32, 39),
        yellow: ansiColor(33, 39),
        blue: ansiColor(34, 39),
        magenta: ansiColor(35, 39),
        cyan: ansiColor(36, 39),
        white: ansiColor(37, 39),
        grey: ansiColor(90, 39),
    };
    function inspectTree(values) {
        return inspectNodes(Object.entries(values).map(function (_a) {
            var key = _a[0], value = _a[1];
            var node = [value];
            return node.reduce(inspectValue(node), [key]).join("\n");
        }), "Object");
    }
    var capitalize = function (str) { return str[0].toUpperCase() + str.slice(1); };
    function inspectNodes(node, type) {
        return (node
            .reduce(inspectValue(node), [
            color.green(capitalize(type !== null && type !== void 0 ? type : typeOf(node))),
        ])
            .join("\n"));
    }
    function indent(value, indentation) {
        if (!value)
            return value;
        return value
            .split("\n")
            .map(function (node, index) { return !index ? node : indentation + node; })
            .join("\n");
    }
    function inspectValue(node) {
        return function (result, curr, index) {
            var init = index + 1 < node.length ? color.grey("├─ ") : color.grey("└─ ");
            var prefix = index + 1 < node.length ? color.grey("|  ") : "   ";
            result.push(init + indent(inspectArgs(curr), prefix));
            return result;
        };
    }
    function inspectNonTree(node) {
        switch (typeOf(node)) {
            case "undefined":
                return color.grey("undefined");
            case "function":
                var name = node.name ? color.white(": ") + node.name : "";
                return color.green(capitalize(typeOf(node))) + name;
            case "boolean":
                return color.yellow(node ? "true" : "false");
            case "bigint":
                return color.yellow(String(node)) + "n";
            case "number":
                return color.yellow(String(node));
            case "symbol":
                var symboliic = /(?<=Symbol\()\w+(?=\))/.exec(node.toString());
                return color.green("Symbol") + color.white(": ") + symboliic.shift();
            default:
                return color.white(node);
        }
    }
    var inspectFields = function (node) {
        var _a;
        if ("length" in node)
            return inspectNodes(node);
        if (typeOf(node).includes("set") && typeOf(node).includes("map"))
            return inspectNodes(Array.from(node), typeOf(node));
        switch (typeOf(node)) {
            case "regexp":
                return ["/", node.source, "/", (_a = /\w+$/.exec(node)) !== null && _a !== void 0 ? _a : ""].join("");
            case "object":
                return inspectTree(node);
        }
    };
    function inspect(node) {
        inspect.prototype.ref = new WeakMap();
        return inspectArgs(node);
    }
    function inspectArgs(node) {
        var recursive = inspect.prototype.ref;
        if (node === null)
            return color.bold("null");
        if (recursive.has(node))
            return recursive.get(node);
        if (typeof node !== "object")
            return inspectNonTree(node);
        recursive.set(node, color.cyan("[Circular]"));
        return inspectFields(node);
    }
    var colorExpression = /\u001b\[\d{1,3}m/g;
    inspect.noColor = function (node) {
        return inspect(node).replace(colorExpression, "");
    };

    var toString = function (node) {
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
                return node;
        }
    };
    function print(object, indent) {
        if (indent === void 0) { indent = 3; }
        if (typeof object !== "object")
            return object;
        var replacer = function (key, value) { return toString(value); };
        if (typeof JSON === "undefined")
            return object;
        return JSON.stringify(object, replacer, indent);
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    function wrap(object) {
        var lastResult = undefined;
        var lastValue = object;
        var lastThis = {
            has: function (path) {
                lastResult = has(object, path);
                return this;
            },
            get: function (path) {
                lastResult = get(object, path);
                return this;
            },
            set: function (path, value) {
                lastResult = set(object, path, value);
                return this;
            },
            update: function (path, callbackFn) {
                lastResult = update(object, path, callbackFn);
                return this;
            },
            del: function (paths) {
                lastResult = del.apply(void 0, __spreadArrays([object], paths));
                return this;
            },
            reset: function (insert) {
                lastResult = reset(object, insert);
                return this;
            },
            forEach: function (callbackFn) {
                lastResult = forEach(object, callbackFn);
                return this;
            },
            map: function (callbackFn) {
                lastResult = map(object, callbackFn);
                return this;
            },
            reduce: function (callbackFn, initialValue) {
                lastResult = reduce(object, callbackFn, initialValue);
                return this;
            },
            walk: function (callbackFn, depth) {
                lastResult = walk(object, callbackFn, depth);
                return this;
            },
            moonWalk: function (callbackFn, depth) {
                lastResult = moonWalk(object, callbackFn, depth);
                return this;
            },
            paths: function () {
                lastResult = paths(object);
                return this;
            },
            merge: function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i] = arguments[_i];
                }
                lastResult = merge.apply(void 0, __spreadArrays([object], items));
                return this;
            },
            print: function () {
                lastResult = print(object);
                return this;
            },
            spread: function (symbol, depth) {
                lastResult = spread(object, symbol, depth);
                return this;
            },
            sortKeys: function () {
                lastResult = sortKeys(object);
                return this;
            },
        };
        return {
            lastResult: lastResult,
            lastValue: lastValue,
            lastThis: lastThis
        };
    }

    var index = {
        clone: clone,
        stringify: stringify$1,
        parse: parse$1,
        print: print,
        inspect: inspect,
        memoize: memoize,
        /**
         * @description flattens an object into a daisy-chain with dots
         * @example
         * //→ { "a.b.c.d": "e" }
         * flatten({ a: { b: { c: { d: "e" } } } }, ".");
         * ---
         * @description flattens an array, infinitely or to a depth level
         * @example
         * //→ [ 1, 2, 3, [ 4, [ 5 ] ] ]
         * flatten([1, [2, [3, [4, [5]]]]], 2);
         */
        flatten: flatten,
        /**
         * @description unflattens an object back to its nested form
         * @example
         * //→ { a: { b: { c: { d: "e" } } } }
         * unflatten({ "a.b.c.d": "e" });
         */
        unflatten: unflatten,
        /**
         * @description Deep-extends an object recursively.
         * @example
         * //→ { margin: { top: "mt-2", bottom: "mb-2" } }
         * merge([{ margin: { top: "mt-2" } }, { margin: { bottom: "mb-2" } }])
         */
        merge: merge,
        /**
         * @description Converts the read-once object syntax into a JS object.
         * @param item The value is a string in the form of a read-once object.
         * @example
         * //→ { margin: { top: 'mt-3', bottom: 'mb-1', x: 'ml-2 mr-4' } }
         * hydrate("margin: { top: mt-3, bottom: mb-1 }; margin.x: ml-2 mr-4")
         */
        hydrate: hydrate,
        /**
         * @description Replaces an object's items without changing the reference.
         */
        reset: reset,
        has: has,
        get: get,
        set: set,
        /**
         * @description Performs the specified action for each node of an object.
         * @param object The object the perform the function on.
         * @param callbackFn A function that accepts up to three arguments. forEach calls the callbackFn function one time for each node in the object.
         * @param thisArg An object to which the this keyword can refer in the callbackFn function. If thisArg is omitted, undefined is used as the this value.
         */
        forEach: forEach,
        /**
         * @description Performs the specified action for each node of an object.
         * @param object The object the perform the function on.
         * @param callbackFn Calls a defined callback function on each node of the object, and returns an object that contains the results.
         * @param thisArg An object to which the this keyword can refer in the callbackFn function. If thisArg is omitted, undefined is used as the this value.
         */
        map: map,
        /**
         * @description Calls the specified callback function for all the nodes of an object. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
         * @param callbackFn — A function that accepts up to four arguments. The reduce method calls the callbackFn function one time for each node of the object.
         * @param initialValue — If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackFn function provides this value as an argument instead of an object value.
         */
        reduce: reduce,
        walk: walk,
        moonWalk: moonWalk,
        paths: paths,
        spread: spread,
        sortKeys: sortKeys,
        del: del,
        update: update,
        wrap: wrap,
        util: {
            charCount: charCount,
            getRef: getRef,
            isObject: isObject,
            sizeOf: sizeOf,
            toPath: toPath,
            typeOf: typeOf,
        },
    };

    return index;

})));
