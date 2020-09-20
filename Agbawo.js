/*!
 * Àgbáwo-1.0.0
 * (c) Ridwan Olanrewaju (2020) MIT
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
    var walker = function (obj) {
        return Reflect.ownKeys(Object.getPrototypeOf(obj))
            .concat(Reflect.ownKeys(obj))
            .reduce(function (a, e) { return ((a[e] = obj[e]), a); }, {});
    };

    var reStr = function (re) { return "/" + re.source + "/" + (/\w+$/.exec(re) || ""); };
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
                    return "_re_" + reStr(value);
            if (value instanceof Function)
                return "_fn_" + fnStr(value);
            if (typeof value === "symbol")
                return "_sm_" + value.toString();
            if (value.constructor.name === "Object") {
                Reflect.ownKeys(value).forEach(function (key) {
                    if (typeof key === "symbol") {
                        value["_sm_" + key.toString()] = value[key];
                    }
                });
            }
            return value;
        };
        return JSON.stringify(obj, replacer || inplace, space);
    }
    function parse(str, reviver) {
        var iso8061 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
        var revive = function (key, value) {
            if (typeof value != "string")
                return value;
            if (value.match(iso8061))
                return new Date(value);
            if (value.startsWith("_fn_") || value.startsWith("_re_"))
                return new Function("return " + trim(value))();
            if (value.startsWith("_sm_"))
                return Symbol.for("" + /\((\w+)\)/.exec(trim(value))[1]);
            return value;
        };
        return JSON.parse(str, reviver || revive);
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

    var decycle = function (base) {
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
            if (typeof current === "string") {
                modified = escapeSpecialChar(current);
            }
            return modified;
        };
        return {
            legend: legend,
            main: walk(base, []),
        };
    };

    var recycle = function (master) {
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
    };

    var Agbawo = {
        walker: walker,
        clone: clone,
        stringify: function (value, replacer, space) {
            var master = decycle(value);
            var legend = stringify(master.legend);
            var main = stringify(master.main, generateReplacer(replacer), space);
            return main !== undefined ? "{\"legend\":" + legend + ",\"main\":" + main + "}" : main;
        },
        parse: function (text, reviver) {
            return recycle(parse(text, generateReviver(reviver)));
        },
    };

    return Agbawo;

})));
