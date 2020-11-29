# Àgbawo [ The Old One ]

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![build status](https://img.shields.io/travis/ibnlanre/Agbawo.svg)](https://travis-ci.org/ibnlanre/Agbawo)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-f8bc45.svg)](https://github.com/prettier/prettier)
![version](https://img.shields.io/badge/version-1.0.1-blue) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
[![Twitter](https://img.shields.io/twitter/follow/ibnlanre?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=ibnlanre)

---

Àgbawo is a Yorùbá name that means an Old-timer, a veteran at best. It is used to compliment or praise a person who has had long service or experience in a particular field. Àgbawo was written to pay respects to a JavaScript Icon, [Douglas Crockford](https://en.wikipedia.org/wiki/Douglas_Crockford), who first specified and popularized the [JSON](https://en.wikipedia.org/wiki/JSON) format.

---

<div align="center">
  <img src="assets/Agbawo.png"><br>
</div>

---

The Swiss-Army knife for working with JS Objects

```markdown
- Cyclic-enabled
- Really Fast
- Heavily Tested
- Browser-compatible
- No Dependencies
- No Eval
```

## Install

```bash
npm i @ibnlanre/agbawo
```

## API

```javascript
// Browser
<script src="https://unpkg.com/@ibnlanre/agbawo@latest/Agbawo.min.js"></script>

// ES6 Import
import Agbawo from "@ibnlanre/agbawo"; //-> default | object
import { stringify, parse, clone } from "@ibnlanre/agbawo";

// NodeJS Require
const { clone } = require("@ibnlanre/agbawo");
const inspect = require("@ibnlanre/agbawo").inspect;

// Walkthrough
stringify(object); //-> cyclic object/symbol support
parse(stringify, replacer); //!-> it replaces the default
inspect(object); //-> a shallow tree walker
```

## JSON Methods

```javascript
const obj = { foo: { bar: null } };
obj.foo.bar = obj.foo;
const str = stringify(obj);
//-> {"legend":[["foo"]],"main":{"foo":{"bar":"~0"}}}
parse(str); //-> { foo: { bar: [Circular] } }
```

## Primitives

```javascript
clone(undefined); //-> undefined
clone(true); //-> true
clone(0); //-> 0
clone("foo"); //-> 'foo'
clone(BigInt(10)); //-> 10n
clone(Symbol("foo")); //-> Symbol(foo)
clone(null); //-> null
```

## Reference Types

### Cyclic Objects

```javascript
const obj = { foo: { bar: null } };
obj.foo.bar = obj.foo;
clone(obj); //=> { foo: { bar: [Circular] } }
```

### Functions

#### Promises

```javascript
let myFirstPromise = new Promise((resolve) =>
  setTimeout(() => resolve("Success!"), 250)
).then((message) => console.log("Yay! " + message));

clone(myFirstPromise);
/*
    Promise { <pending> }
    Yay! Success!
*/
```

#### Function Statements

```javascript
function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError("array-unique expects an array.");
  }
  return arr.length;
}
unique.prototype.greet = () => "hello";
clone(unique)([1, 2, 3]); //-> 3
clone(unique).prototype.greet(); //-> hello
```

#### Function Expressions

```javascript
let test = function () {
  return 0;
};
clone(test); //-> [Function: test]
clone(test).toString(); //-> function(){ return 0 }
clone(test) === test; //-> false
```

#### Constructor Functions

```javascript
var Person = function (name) {
  this.name = name;
  this.canTalk = true;
};

Person.prototype.greet = function () {
  if (this.canTalk) {
    console.log("Hi, I am " + this.name);
  }
};

console.log("greet" in clone(Person).prototype); // true
console.log("greet" in Person); // false
```

#### Asynchronous Functions

```javascript
clone(async (a, b) => a + b); //-> async (a, b) => a + b
```

#### Function Constructors

```javascript
clone(new Function("a", "b", "return 'hello'"));
/*
    function anonymous(a,b
    ) {
    return 'hello'
    }
*/
```

#### Generator Functions

```javascript
clone(function* (b, c) {
  yield 0;
}); //-> [GeneratorFunction]
```

#### Arrow functions

```javascript
clone(() => {}).toString(); //-> () => { }
```

### Arrays

```javascript
let sequence = [1, 1, [2, 5], 3, 5];
clone(sequence); //-> [1, 1, [2, 5], 3, 5]
```

#### Typed Arrays

```javascript
clone(new Int8Array(2)); //-> Int8Array [ 0, 0 ]
clone(new Uint8Array(2)); //-> Uint8Array [ 0, 0 ]
clone(new Uint8ClampedArray(new ArrayBuffer(6), 1, 4));
//-> Uint8ClampedArray [ 0, 0, 0, 0 ]

clone(new Int16Array(2)); //-> Int16Array [ 0, 0 ]
clone(new Uint16Array(2)); //-> Uint16Array [ 0, 0 ]

clone(new Int32Array(2)); //-> Int32Array [ 0, 0 ]
clone(new Uint32Array(2)); //-> Uint32Array [ 0, 0 ]

clone(new Float32Array(2).BYTES_PER_ELEMENT); //-> 4
clone(new Float64Array(2).BYTES_PER_ELEMENT); //-> 8

clone(new BigInt64Array([21n, 31n])); //-> BigInt64Array [ 21n, 31n ]

var iterable = (function* () {
  yield* [1n, 2n, 3n];
})();
var biguint64 = new BigUint64Array(iterable);
clone(biguint64); //-> BigUint64Array[1n, 2n, 3n]
```

### Buffers

```javascript
clone(new ArrayBuffer(8));
/*
    ArrayBuffer {
      [Uint8Contents]: <00 00 00 00 00 00 00 00>,
      byteLength: 8
    }
*/

clone(Buffer.from("hello", "utf16le"));
//-> <Buffer 68 00 65 00 6c 00 6c 00 6f 00>
```

### Dates

```javascript
clone(new Date("1986-05-21T00:00:00.000Z"));
//-> 1986-05-21T00:00:00.000Z
```

### Symbols

```javascript
const a = Symbol("a");
class Foobar {
  constructor(_a) {
    this[a] = { [_a]: null };
  }
}
const foobar = new Foobar("aaa");
foobar[a]["aaa"] = foobar[a];

foobar //-> Foobar { [Symbol(a)]: { aaa: [Circular] } }
stringify(a) //-> {"legend":[],"main":"_sm_Symbol(a)"}
parse(stringify(foobar)) //-> { [Symbol(a)]: { aaa: [Circular] } }
console.log(clone(a) === a); //-> true
```

## Note-worthy Mentions

- [Louis Buchbinder](https://github.com/louisbuchbinder) -> [cyclical-json](https://github.com/louisbuchbinder/cyclical-json)
- [Royaltm](https://github.com/royaltm) -> [function cloning](https://stackoverflow.com/questions/1833588/javascript-clone-a-function)
- [Vadim Kiryukhin](https://github.com/vkiryukhin) -> [json-fn](https://github.com/vkiryukhin/jsonfn)
- [Alex Reardon](https://github.com/alexreardon) -> [memoize-one](https://github.com/alexreardon/memoize-one)
