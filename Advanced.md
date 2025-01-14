# JavaScript Advanced

## Functions

### Functions accepting functions

```js
function square(x) {
    return x * x;
}

square(3) // 9


function twice(f, x) {
    return f(f(x));
}

twice(square, 3) // 81
```

### Closures: Functions returning functions

```js
function twice(f) {
    return function (x) {
        return f(f(x));
    }
}

const hypercube = twice(square);

hypercube(3) // 81

twice(square)(3) // 81
```

- Inner functions have access to variables of their outer function
- Even after the outer function (here `twice`) has returned!
- JavaScript even allows modification of the outer variables:

```js
function makeCounter() {
    let next = 1;

    return function () {
        return next++;
    };
}

const a = makeCounter();
const b = makeCounter();

// 1    2         3
[  a(), a(), b(), a(), b(), b()  ] // [1, 2, 1, 3, 2, 3]
//           1         2    3
```

> **Exercise:**
> - Complete the function `makeFibonacci`:

```js
function makeFibonacci() {
    // TODO initialize state

    return function () {
        // TODO update state
        // TODO return value
    };
}

const f = makeFibonacci();

// 0    1    1    2    3    5    8    13   21   34   55   89
[  f(), f(), f(), f(), f(), f(), f(), f(), f(), f(), f(), f()  ]
```

### Generators

- What is wrong with the following function?

```js
function fibonacci() {
    const result = [];

    let a = 0n;
    result.push(a);            // 0n

    let b = BigInt(1);
    result.push(b);            // 1n

    while (true) {
        result.push(a += b);   // 1n    3n    8n     21n     55n     ...
        result.push(b += a);   //    2n    5n    13n     34n     89n     ...
    }

    return result;
}
```

- The infinite `while(true)` loop keeps consuming memory
  - This will eventually throw an out-of-memory error
- The unreachable `return` statement is never executed
  - Generators “return” each element separately for immediate consumption:

```js
/////// v
function* fibonacci() {
    let a = 0n;
    yield a;            // 0n

    let b = BigInt(1);
    yield b;            // 1n

    while (true) {
        yield a += b;   // 1n    3n    8n     21n     55n     ...
        yield b += a;   //    2n    5n    13n     34n     89n     ...
    }
}

const generator = fibonacci();

generator.next();       // { value: 0n, done: false }
generator.next();       // { value: 1n, done: false }
generator.next();       // { value: 1n, done: false }
generator.next();       // { value: 2n, done: false }
generator.next();       // { value: 3n, done: false }
generator.next();       // { value: 5n, done: false }
generator.next();       // { value: 8n, done: false }
```

- Generator `function*`s return generator objects
- Generator objects are iterable:

```js
for (const x of fibonacci()) {
    if (x >= 1000) break;

    log(x); // 0n 1n 1n 2n 3n 5n 8n 13n 21n 34n 55n 89n 144n 233n 377n 610n 987n
}
```

- Iterating over generator objects roughly desugars to:

```js
const generator = fibonacci();
let x, done;
//     destructuring
while ({value: x, done} = generator.next(), !done) {
    if (x >= 1000) break;              // ^
                                       // comma operator
    log(x);
}
```

> **Exercise:**
> - Complete the generator function `finiteCounter`:

```js
function* finiteCounter(from, to) {
    // TODO
}

const counter = finiteCounter(7, 9);

counter.next() // {done: false, value: 7}
counter.next() // {done: false, value: 8}
counter.next() // {done: false, value: 9}

counter.next() // {done: true,  value: undefined}
```

## Objects

- A JavaScript object is essentially a `java.util.LinkedHashMap<String, Object>`

```js
// Object literal
const account = { balance: 1000, getBalance: function () { return this.balance; } };

// read properties
account["balance"]   // 1000
account.balance      // 1000
account.getBalance   // [Function: getBalance]
account.getBalance() // 1000

// write properties
account["id"]   = 42;
account.deposit = function (amount) { this.balance += amount; };

// delete properties
delete account.id;
```

- Properties are accessed:
  - unquoted after dot, or
  - quoted inside brackets
- Objects are class-free
  - Properties can be added and removed at will

### Factory functions

```js
function createAccount(initialBalance, accountId) {
    return {
        balance: initialBalance,
        id: accountId,

        deposit: function (amount) {
            this.balance += amount;
        },

        getBalance: function () {
            return this.balance;
        },
    };
}

const account = createAccount(1000, 42);
// { balance: 1000, id: 42, deposit: [Function: deposit], getBalance: [Function: getBalance] }

account.deposit(234);
account.getBalance() // 1234

createAccount(1234, 42).getBalance === account.getBalance // false
```

### Object inheritance

```js
const accountMethods = {
    deposit: function (amount) {
        this.balance += amount;
    },

    getBalance: function () {
        return this.balance;
    },
};

function createAccount(initialBalance, accountId) {
    return {
        __proto__: accountMethods,

        balance: initialBalance,
        id: accountId,
    };
}

const account = createAccount(1000, 42);
// { balance: 1000, id: 42 }

account.__proto__
// { deposit: [Function: deposit], getBalance: [Function: getBalance] }

account.deposit(234);
account.getBalance() // 1234

createAccount(1234, 42).getBalance === account.getBalance // true
```

- *Reading* a property `obj.key` starts at `obj` and climbs the inheritance chain:
  - `obj.key`
  - `obj.__proto__.key`
  - `obj.__proto__.__proto__.key`
  - `obj.__proto__.__proto__.__proto__.key`
  - etc. until `key` is found (or `__proto__` is `null`)
- *Writing* a property `obj.key = value` ignores `obj.__proto__`

### Constructor functions

```js
function Account(initialBalance, accountId) {
    this.balance = initialBalance;
    this.id = accountId;
}

// Account.prototype = { constructor: Account };

Account.prototype.deposit = function (amount) {
    this.balance += amount;
};

Account.prototype.getBalance = function () {
    return this.balance;
};

            /* Account.call({ __proto__: Account.prototype },
                            1000, 42) */
const account = new Account(1000, 42);
// Account { balance: 1000, id: 42 }

account.__proto__
// { deposit: [Function (anonymous)], getBalance: [Function (anonymous)] }

account.deposit(234);
account.getBalance() // 1234

new Account(1234, 42).getBalance === account.getBalance // true
```

- By convention, functions starting with an uppercase letter are *constructor functions*
  - Must be invoked with `new` to create `{ __proto__: F.prototype }`
  - Otherwise, `this` is `undefined`
- *Every* function has an associated `prototype` property
  - But it's only useful for constructor functions
- Key points to remember:
  - `new T()` objects store fields
  - `T.prototype` object stores methods
  - `new T().__proto__ === T.prototype`
  - `new T().constructor === T`

> **Exercise:** Add `withdraw` functions to the 3 previous `Account` examples:
> - “Factory functions”
> - “Object inheritance”
> - “Constructor functions”

| Function call syntax      | `this`      |
| ------------------------- | :---------: |
| `f(x, y, z)`              | `undefined` |
| `obj.f(x, y, z)`          | `obj`       |
| `new F(x, y, z)`          | `{ __proto__: F.prototype }` |
| `f.apply(obj, [x, y, z])` | `obj`       |
| `f.call(obj, x, y, z)`    | `obj`       |
| `f.bind(obj, x)(y, z)`    | `obj`       |

&nbsp;

![](img/proto.svg)

### The `class` keyword

> Even though ECMAScript includes syntax for class definitions,
> **[ECMAScript objects](https://tc39.es/ecma262/#sec-objects) are not fundamentally class-based**
> such as those in C++, Smalltalk, or Java

```js
class Account {
    constructor(initialBalance, accountId) {
        this.balance = initialBalance;
        this.id = accountId;
    }

    deposit(amount) {
        this.balance += amount;
    }

    getBalance() {
        return this.balance;
    }
}

const account = new Account(1000, 42);
// Account { balance: 1000, id: 42 }

account.__proto__                       // {}
account.__proto__ === Account.prototype // true
account.__proto__.deposit               // [Function: deposit]
account.__proto__.getBalance            // [Function: getBalance]
```

- Less rigid than the `class` keyword may suggest:

```js
const account = new Account(1000, 42);

// add field to object
account.audited = true;

// delete field from object
delete account.id;

// deactivate method for object
account.deposit = undefined;

// delete method from class
delete Account.prototype.deposit;

// change an object's class after creation
account.__proto__ = SavingsAccount.prototype;
```

### Callbacks and `this`

```js
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

class Account {
    constructor() {
        this.balance = 0;
    }

    depositTomorrow(amount) {
        setTimeout(() => {
            this.balance += amount; // this = the account object
        }, MILLISECONDS_PER_DAY);
    }

    depositTomorrow_failsSilently(amount) {
        setTimeout(function () {
            this.balance += amount; // this = the global object (window)
        }, MILLISECONDS_PER_DAY);
    }

    depositTomorrow_worksVintage(amount) {
        var that = this;            // this = the account object
        setTimeout(function () {
            that.balance += amount; // that = the account object
        }, MILLISECONDS_PER_DAY);
    }

    deposit(amount) {
        this.balance += amount;
    }

    depositTomorrow_failsAgain(amount) {
        setTimeout(this.deposit, MILLISECONDS_PER_DAY);
        //         this.deposit does not preserve this for later call
        //        (also, amount will be undefined)
    }

    depositTomorrow_worksAgain(amount) {
        setTimeout(this.deposit.bind(this, amount), MILLISECONDS_PER_DAY);
        //                      preserves this (and amount) for later call
    }
}
```

- Ordinary functions `function () {}` do not preserve outer `this`
  - Arrow functions `() => {}` do
- Uncalled methods `obj.method` do not bind `this` to `obj`
  - Bound methods `obj.method.bind(obj)` do

### Polyfills

- Since 2023, arrays have a `toSorted` method:

```js
const sortedByYear = people.toSorted((a, b) => a.year - b.year);
                            ////////
```

- Not all JavaScript environments provide `toSorted` yet
- In that case, it can be monkey-patched into the prototype:

```js
if (Array.prototype.toSorted === undefined) {
    Array.prototype.toSorted = function (compare) {
        const copy = this.clone(); // doesn't actually work; arrays have no clone method
        copy.sort(compare);
        return copy;
    };
}
```

> **Exercise:**
> - Provide a `clone` method on arrays such that `a.clone()` works:

```js
// Implement your array clone method here...

const a = [2, 3, 5, 7];
const b = a.clone(); // ...such that this line of code works, as is

a // [2, 3, 5, 7]
b // [2, 3, 5, 7]

a !== b // true; 2 objects, not 1
```

## Modules

### Problem

- `.html` files traditionally “import” all required `.js` files:

```html
<script src="a.js"></script>
<script src="b.js"></script>
<script src="c.js"></script>
```

- `.js` files traditionally *cannot* “import” other `.js` files
- Hence the dependencies of a `.js` file are:
  - neither obvious,
  - nor enforcable
- Implementation details can easily leak into/pollute the global scope
  - What if `a.js` and `b.js` both define a `function f()`?

### Solution

- One `.js` file per module
- Explicit `export`s and `import`s between `.js` files
- Simple but effective

### Named exports

```js
// file trig.js

export const PI = 3.141592653589793;
const RADIANS_PER_DEGREE = PI / 180; // unexported

export function radians(degrees) {
    return degrees * RADIANS_PER_DEGREE;
}

export function degrees(radians) {
    return radians / RADIANS_PER_DEGREE;
}

export function distance(x, y) {
    return Math.sqrt(square(x) + square(y));
}

// unexported
function square(x) {
    return x * x;
}
```

### Named imports

```js
// some other file

import { PI, distance as distanceFromOrigin } from './trig.js';

const distance = 1.5;

console.log(PI);
console.log(distanceFromOrigin(3, 4));
```

### Namespace import

```js
// some other file

import * as trig from './trig.js';

const distance = 1.5;

console.log(trig.PI);
console.log(trig.distance(3, 4));
```

### Browser support

- Traditionally, all modules are bundled into a single `bundle.js` file
  - by module bundlers like Webpack
  - requires additional build step
- These days, browsers support modules directly, but:
  - ⚠️ Modules **must** be served by a (local) web server
    - “double-click on `index.html`” will *not* work
    - browse `http://localhost:8080` instead
  - Any web server capable of serving files from the file system will do, for example:

|                                | Node                         | Debian derivatives       |
| ------------------------------ | ---------------------------- | ------------------------ |
| install (once, from anywhere)  | `npm install -g http-server` | `sudo apt install webfs` |
| serve (from project directory) | `http-server`                | `webfsd -F -p 8080`      |

### HTML `script` tag

- Execute all JavaScript code inside a module:

```html
<script type="module" src="filename.js">
```

- ⚠️ Exported module functions are invisible to HTML tag attributes:

```html
<button onclick="callback()">I have never met this callback in my life</button>
```

- Import and register the callback inside a module script instead:

```html
<button id="button">Of course I know him</button>

<script type="module">
import { callback } from "filename.js";

document.getElementById("button").onclick = callback;
</script>
```

> **Exercise:**
> - Convert `projects/01 password` to modules

## Privacy

- Before 2022, JavaScript had no private properties:

```js
class Account {
    constructor(initialBalance) {
        this.balance = initialBalance;
    }

    deposit(amount) {
        this.balance += amount;
    }

    getBalance() {
        return this.balance;
    }
}

const a = new Account(123);

a.balance = 1000000; // whoops
```

### ES2022

- Since 2022, private properties are marked with the `#` prefix:

```js
class Account {
    #balance; // mandatory declaration

    constructor(initialBalance) {
        this.#balance = initialBalance;
    }

    deposit(amount) {
        this.#balance += amount;
    }

    getBalance() {
        return this.#balance;
    }
}

const a = new Account(123);

a.#balance = 1000000;
// Uncaught SyntaxError: Private field '#balance' ...
// Property '#balance' is not accessible outside class 'Account' ...
```

- Many JavaScript programmers are not aware of this syntax, yet

### ES2015

- Between 2015 and 2022, private properties could be simulated with modules and `WeakMap`s:

```js
// file Account.js

const properties = new WeakMap(); // unexported, i.e. inaccessible outside the module

export class Account {
    constructor(initialBalance) {
        properties.set(this, {
            balance: initialBalance,
        });
    }

    deposit(amount) {
        properties.get(this).balance += amount;
    }

    getBalance() {
        return properties.get(this).balance;
    }
}
```

```js
// some other file

import { Account } from './Account.js';

const a = new Account(123);

properties.get(this).balance = 1000000;
// Uncaught ReferenceError: properties is not defined
```

- Why `WeakMap` instead of `Map`?
  - A normal `Map` would keep growing with every `new Account`
  - But a `WeakMap` can shrink during garbage collection
- This approach to privacy is not widespread

### 1995 Closures

- Closures were always powerful enough to simulate privacy:

```js
function createAccount(balance) {
    return {
        deposit: function(amount) {
            balance += amount;
        },

        getBalance: function() {
            return balance;
        },
    };
}

const a = createAccount(123);

a.balance = 1000000; // unrelated property
a.getBalance()       // 123
a.balance            // 1000000
```

- Note how `deposit` and `getBalance` close over `balance`
  - That `balance` is *not* an object property!
- Also note the low number of keywords
- Lisp programmers love this style
  - Other programmers... usually don't
- In practice, programmers either
  - just don't care about privacy that much, or
  - use `private` in TypeScript:

### TypeScript

```ts
class Account {
    private balance: number;

    constructor(initialBalance: number) {
        this.balance = initialBalance;
    }

    // ...
}

const a = new Account(123);

a.balance = 1000000;
// Property 'balance' is private and only accessible within class 'Account'
```

- The property and constructor can be fused together:

```ts
class Account {
    constructor(private balance: number) {
    }

    // ...
}

const a = new Account(123);

a.balance = 1000000;
// Property 'balance' is private and only accessible within class 'Account'
```

- This approach to privacy is very popular
  - Everybody knows `private` from some other language
- Note that `private` is only checked at compile-time
  - If you want to shoot yourself in the foot, `private` can be circumvented:

```ts
const a = new Account(123);

(a as any).balance = 1000000; // Well, if you insist...
```
