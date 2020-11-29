/*!
 * Àgbawo-1.0.1 (2020) MIT
 * (c) Ridwan Olanrewaju 
 * @ibnlanre
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
    var type = function (e, what) {
        return (e === null || e === void 0 ? void 0 : e.constructor.name) === what;
    };
    var hydrate = function (_a) {
        var name = _a[0], value = _a[1];
        return name
            .split(/\b\.\b/)
            .reduceRight(function (set, curr) {
            var _a;
            return (_a = {}, _a[curr] = set, _a);
        }, value);
    };
    var filter = function (es, what) {
        return es.filter(function (e) { return type(e, what); });
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
        try {
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

    function memoize (passedFn) {
        var lastThis;
        var lastArgs = [];
        var lastResult;
        var calledOnce = false;
        var isEqual = function (newInputs, lastInputs) {
            if (newInputs.length !== lastInputs.length)
                return false;
            for (var i = 0; i < newInputs.length; i++)
                if (newInputs[i] !== lastInputs[i])
                    return false;
            return true;
        };
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

    function restock (item, slot) {
        var induce = function (acc, _a) {
            var name = _a[0], value = _a[1];
            return ((acc[name] = value), acc);
        };
        Object.keys(item).forEach(function (name) { return delete item[name]; });
        Object.entries(slot).reduce(induce, item);
        return item;
    }

    var merge = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var res = {};
        items.forEach(function (obj) {
            for (var key in obj) {
                var check = obj.hasOwnProperty(key) && type(obj[key], "Object");
                res[key] = check ? merge(res[key], obj[key]) : obj[key];
            }
        });
        return res;
    };
    var unflatten = function (item) {
        return merge.apply(void 0, Object.entries(item).map(hydrate));
    };
    var flatten = function (obj, parent, res) {
        if (res === void 0) { res = {}; }
        for (var key in obj) {
            var propName = parent ? parent + "." + key : key;
            if (type(obj[key], "Object"))
                flatten(obj[key], propName, res);
            else
                res[propName] = obj[key];
        }
        return res;
    };
    var deflate = function (list, depth, level) {
        if (depth === void 0) { depth = Infinity; }
        if (level === void 0) { level = 1; }
        return list.reduce(function (acc, item) {
            var arr = Array.isArray(item) && level < depth;
            return acc.concat(arr ? deflate(item, depth, ++level) : item);
        }, []);
    };
    var spread = function (item) {
        var regex = function (symbol) { return new RegExp("\\s*" + symbol + "\\s*"); };
        var colon = function (item) { return item.split(regex(":")); };
        var semi = function (item) { return item.split(regex(";")).filter(Boolean); };
        return semi(item.trim()).map(colon).map(hydrate);
    };
    var combine = function () {
        var list = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            list[_i] = arguments[_i];
        }
        var sequence = filter(list, "Object");
        var series = deflate(filter(list, "String").map(spread));
        return merge.apply(void 0, sequence.map(unflatten).concat(series));
    };

    function inspect (obj) {
        return Reflect.ownKeys(Object.getPrototypeOf(obj))
            .concat(Reflect.ownKeys(obj))
            .reduce(function (a, e) { return ((a[e] = obj[e]), a); }, {});
    }

    var index = {
        clone: clone,
        stringify: stringify$1,
        parse: parse$1,
        inspect: inspect,
        /**
         * @description replaces an object's items without changing the reference
         * @example
         * //→ { 'colors.purple': 'bg-purple-500' }
         * memoize({ color: "pink" }, { "colors.purple": "bg-purple-500" })
         */
        memoize: memoize,
        /**
         * @description flattens an object separating its key with dots
         * @example
         * //→ { 'key3.a.b.c': 2 }
         * flatten({ key3: { a: { b: { c: 2 } } } });
         */
        flatten: flatten,
        /**
         * @description unflattens an object back to its nested form
         * @example
         * //→ { "user": { "key_value_map": { "CreatedDate": "123424" } } }
         * unflatten({ 'user.key_value_map.CreatedDate': '123424' });
         */
        unflatten: unflatten,
        /**
         * @description flattens an array, infinitely or to a depth level
         * @example
         * //→ [ 1, 2, 3, [ 4, [ 5 ] ] ]
         * deflate([1, [2, [3, [4, [5]]]]], 2)
         */
        deflate: deflate,
        /**
         * @description deep-extends an object recursively
         * @example
         * //→ { margin: { top: "mt-2", bottom: "mb-2" } }
         * merge({ margin: { top: "mt-2" }, { margin: { bottom: "mb-2" } })
         */
        merge: merge,
        /**
         * @description disintegrates the css object syntax into js objects
         * @example
         * //→ [{ margin: { top: "mt-3" } }, { margin: { bottom: "mb-3" } }]
         * spread("margin.top: mt-3; margin.bottom: mb-3")
         */
        spread: spread,
        /**
         * @description spreads strings, unflattens objects, then combines
         * @example
         * //→ { colors: { purple: 'bg-purple-500', pink: 'bg-pink-500' } }
         * combine("colors.pink: bg-pink-500", { "colors.purple": "bg-purple-500" })
         */
        combine: combine,
        /**
         * @description replaces an object's items without changing the reference
         * @example
         * //→ { 'colors.purple': 'bg-purple-500' }
         * restock({ color: "pink" }, { "colors.purple": "bg-purple-500" })
         */
        restock: restock,
    };

    return index;

})));
