# JavaScript Advanced

## Functions

### Functions as arguments

```js
                       /////////
function filter(array, predicate) {
    const result = [];

    for (let i = 0; i < array.length; ++i) {
        if (predicate(array[i], i, array)) result.push(array[i]);
            /////////////////////////////
    }

    return result;
}

const primes = [ 11, 2, 3, 13, 5, 7, 17, 19 ];

filter(primes, x => x < 10); // [ 2, 3, 5, 7 ]
               ///////////
```

### Functions as return values

```js
function smallerThan(limit) {
    return x => x < limit;
}          //////////////

filter(primes, smallerThan(10)); // [ 2, 3, 5, 7 ]
               ///////////////
```

- Inner functions have *access* to variables of their outer function
- Even after the outer function (here `smallerThan`) has returned!
- JavaScript even allows *modification* of the outer variables:

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
[  a(), a(), b(), a(), b(), b()  ]  // [1, 2, 1, 3, 2, 3]
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

while ({value: x, done} = generator.next(), !done) {
    // destructuring                   // ^
}                                      // comma operator
```

> **Exercise:**
> - Fix the generator function `finiteCounter` below
>   - It should yield *all* elements from `first` to `last`
> - Validate the parameters `first` and `last`
>   - Exceptions won't be thrown until the first `.next` call
>   - 🏆 Can you already throw at the `finiteCounter` call?
> - Implement the generator function `findWordPositions` below
>   - [string.indexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)

```js
function* finiteCounter(first, last) {
    // FIXME
    yield first;
    yield last;
}

const counter = finiteCounter(7, 9);

counter.next(); // {done: false, value: 7}
counter.next(); // {done: false, value: 8}
counter.next(); // {done: false, value: 9}

counter.next(); // {done: true,  value: undefined}
```

```js
function* findWordPositions(text, word) {
    // TODO
}

const t = `Wenn hinter Fliegen Fliegen fliegen,
fliegen Fliegen Fliegen nach.`;

findWordPositions(t, "Fliegen").toArray();

[12, 20, 45, 53]
```

## Objects

> Even though ECMAScript includes syntax for class definitions,  
> **[ECMAScript objects](https://tc39.es/ecma262/#sec-objects) are *not* fundamentally class-based**  
> (such as those in C++, Smalltalk, or Java).  

- Spot the difference:

```js
const britisch = {
    Erdnuss: "peanut",
    Keks: "biscuit",
    Kremeis: "ice cream",
    Pommes: "potato chips",
    Schokolade: "chocolate",
};

const amerikanisch = {
    Erdnuss: "peanut",
    Keks: "biscuit",
    Kremeis: "ice cream",
    Pommes: "french fries",
    Schokolade: "chocolate",
};
```

- Most words are the same
- Isn't this a waste of memory?

### Object inheritance

- `amerikanisch` can *inherit* most words from `britisch`:

```js
const britisch = {
    Erdnuss: "peanut",
    Keks: "biscuit",
    Kremeis: "ice cream",
    Pommes: "potato chips",
    Schokolade: "chocolate",
};

const amerikanisch = {
    __proto__: britisch, // inheritance

    Pommes: "french fries",
};
```

- How does inheritance affect word access?

```js
amerikanisch.Pommes             // french fries
amerikanisch.Erdnuss            // peanut
amerikanisch.__proto__.Erdnuss  // peanut

amerikanisch.Keks = "cookie";
amerikanisch.Keks               // cookie
    britisch.Keks               // biscuit

amerikanisch.Schokolade += "!!!";
amerikanisch.Schokolade         // chocolate!!!
    britisch.Schokolade         // chocolate
```

- 👁️ `obj.key`
  - starts at `obj` and climbs the `__proto__` chain
  - until `key` is found, or `__proto__` is `null`
- ✍️ `obj.key = value`
  - ignores `obj.__proto__` completely
- ⚠️ `obj.key += value`
  - just syntax sugar for ✍️ `obj.key = obj.key + value` 👁️

### The mother of all objects

- The default `__proto__` is `Object.prototype`:

```js
const britisch = {
    __proto__: Object.prototype, // default

    // ...
};

const amerikanisch = {
    __proto__: britisch,

    // ...
};
```

- `Object.prototype` contains half a dozen functions:

```js
Object.prototype = {
    hasOwnProperty(key) {
        // ...
    },

    isPrototypeOf(child) {
        // ...
    },

    toString() {
        // ...
    },

    // ...

    __proto__: null, // orphan
};
```

- `for in` includes inherited properties:

```js
for (const deutsch in amerikanisch) {
    if (amerikanisch.hasOwnProperty(deutsch)) {
        log(`Die Amis haben ein eigenes Wort für ${deutsch}.`);
    } else {
        log(`Briten und Amis haben dasselbe Wort für ${deutsch}.`);
    }
}
```

### ES2015 `class` syntax

> [Nordic.js 2014 • Douglas Crockford - The Better Parts](https://www.youtube.com/watch?v=PSGEjv3Tqo0):
> `class` was *the* most requested new feature in JavaScript.  
> All of the requests came from **Java programmers** who *have* to program in JavaScript and don't want to learn how to do that.  
> They wanted something that *looks* like Java so that they could be **more comfortable**.  

```js
class Account {
    constructor(balance) {
        this.balance = balance;
    }

    deposit(amount) {
        this.balance += amount;
    }

    getBalance() {
        return this.balance;
    }
}

const a = new Account(100);

a.deposit(23);
a.getBalance()     // 123
```

### What is `Account`, really?

```js
a  instanceof     Account      // true... Is Account a class?

a.constructor === Account      // true... Is Account a constructor?

           typeof Account      // "function"... It's a function!

                  Account(42)  // TypeError: class constructors must be invoked with 'new'

              new Account(42); // { balance: 42 }
```

### But where are the methods?

```js
      a            // { balance: 123 }

      a.__proto__  // { constructor, deposit, getBalance }

Account.prototype  // { constructor, deposit, getBalance }
```

- `new Account(123)` does 2 things:
  1. creates fresh object `{ __proto__: Account.prototype }`
  2. runs constructor function
- key points to remember:
  - `new T()` objects store fields
  - `T.prototype` object stores methods
  - `new T().__proto__ === T.prototype`
  - `new T().constructor === T`

### 1995 `prototype` syntax

<table>
<tr>
<th>prototype</th>
<th>class</th>
</tr>
<tr>
<td>

```js
function Account(balance) {
    this.balance = balance;
}

// Account.prototype = { constructor: Account };

Account.prototype.deposit = function (amount) {
    this.balance += amount;
};

Account.prototype.getBalance = function () {
    return this.balance;
};

const a = new Account(100);

a.deposit(23);
a.getBalance()     // 123
```

</td>
<td>

```js
class Account {
    constructor(balance) {
        this.balance = balance;
    }

    deposit(amount) {
        this.balance += amount;
    }

    getBalance() {
        return this.balance;
    }
}

const a = new Account(100);

a.deposit(23);
a.getBalance()     // 123
```

</td>
</tr>
</table>

### A false sense of rigidity

- `class` is mostly syntax sugar for `prototype`
- In particular, `class` is no more *rigid* than `prototype`:

```js
class Account {
    // ...
}

const a = new Account(123);

// add field to object
a.audited = true;

// delete field from object
delete a.balance;

// deactivate method for object
a.deposit = undefined;

// delete method from class
delete Account.prototype.deposit;

// change object's class after creation
a.__proto__ = SavingsAccount.prototype;
```

- 🕷️ With great power comes great responsibility
- 🕵️ Quite useful for testing (mock, spy)

### What's `this` inside functions?

| Function call syntax      | `this` value                 |
| ------------------------- | ---------------------------- |
| `f(x, y, z)`              | `undefined` or global object |
| `obj.f(x, y, z)`          | `obj`                        |
| `new F(x, y, z)`          | `{ __proto__: F.prototype }` |
| `f.apply(obj, [x, y, z])` | `obj`                        |
| `f.call(obj, x, y, z)`    | `obj`                        |
| `f.bind(obj, x)(y, z)`    | `obj`                        |

### Polyfills

- Since ES2023, arrays have a `toSorted` method:

```js
const primes = [ 11, 2, 3, 13, 5, 7, 17, 19 ];

const sorted = primes.toSorted((a, b) => a - b);

primes      // [ 11, 2, 3, 13, 5, 7, 17, 19 ]

sorted      // [ 2, 3, 5, 7, 11, 13, 17, 19 ]
```

- Not all JavaScript environments provide `toSorted` yet
- In that case, it can be monkey-patched into the prototype:

```js
if (Array.prototype.toSorted === undefined) {
    Array.prototype.toSorted = function (compare) {
        const copy = [...this]; // spread operator
        copy.sort(compare);
        return copy;
    };
}
```

> **Exercise:**
> - Provide a `toReversed` method on arrays
> - 🏆 Provide a `toReversed` method on strings

```js
// Implement your array toReversed method here...

const a = [ "peanuts", "and", "chocolate" ];
const b = a.toReversed(); // ...such that this line of code works, unmodified

a  // [ "peanuts", "and", "chocolate" ]
b  // [ "chocolate", "and", "peanuts" ]
```

## Modules

> **Exercise:**
> - Move your JavaScript code from `projects/01 password/index.html` into its own `index.js` file
> - before:

```html
</body>
<script src="sha1.js"></script>
<script>
// ... your JavaScript code ...
// CUT and PASTE into index.js
</script>
</html>
```

> - after:

```html
</body>
<script src="sha1.js"></script>
<script src="index.js"></script>
</html>
```

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

> **Exercise:**
> - Convert `projects/01 password` to modules:
>   - Which function(s) inside `sha1.js` are required by others? Add `export`(s) and `import`(s)
>   - Which function(s) inside `index.js` are required by others? Add `export`(s)
>   - Replace both `<script src="...">` with a single `<script type="module" src="...">`
> - Start `http-server`
> - Browse `localhost:8080`
>   - Try some passwords; it should no longer work
>   - Open the developer console (F12)
>   - You should see `ReferenceError: yourCallbackFunction is not defined` messages
>   - The next section describes how to fix it

### `onclick` and friends

- Exported module functions are invisible to HTML tag attributes:

```html
<button onclick="callback()">I have never met this callback in my life</button>
        ////////////////////


<script type="module" src="index.js"></script>
```

- Import and register the callback inside a module script instead:

```html
<button id="button">Of course I know him</button>


<script type="module">
import { callback } from "./index.js";

document.getElementById("button").onclick = callback;
</script>                         //////////////////
```

## Encapsulation

- Before ES2022, fields were always public:

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

a.balance = 1000000; // Who wants to be a millionaire?
```

### ES2022 `#`

- Since ES2022, the `#` prefix marks private fields:

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

- recent feature
- unique syntax

### ES2015 `WeakMap`

- Since ES2015, encapsulation can be achieved with `WeakMap`s inside modules
- one `WeakMap` per property:

```js
// file Account.js

const _Account_balance = new WeakMap(); // unexported, i.e. inaccessible outside the module

export class Account {
    constructor(initialBalance) {
        _Account_balance.set(this, initialBalance);
    }

    deposit(amount) {
        _Account_balance.set(this, _Account_balance.get(this) + amount);
    }

    getBalance() {
        return _Account_balance.get(this);
    }
}
```

```js
// some other file

import { Account } from './Account.js';

const a = new Account(123);

_Account_balance.set(this, 1000000);
// Uncaught ReferenceError: _Account_balance is not defined
```

- one `WeakMap` per class:

```js
// file Account.js

const _Account = new WeakMap(); // unexported, i.e. inaccessible outside the module

export class Account {
    constructor(initialBalance) {
        _Account.set(this, {
            balance: initialBalance,
        });
    }

    deposit(amount) {
        _Account.get(this).balance += amount;
    }

    getBalance() {
        return _Account.get(this).balance;
    }
}
```

- Why `WeakMap` instead of `Map`?
  - A normal `Map` would keep growing with every `new Account`
  - But a `WeakMap` can shrink during garbage collection
- TypeScript transpiles `#` to `WeakMap` for targets older than ES2022

### 1995 Closures

- Encapsulation has always been achievable with closures:

```js
function createAccount(balance) {
    return {
        deposit(amount) {
            balance += amount;
        },

        getBalance() {
            return balance;
        },
    };
}

const a = createAccount(123);

a.balance = 1000000; // unrelated property
a.getBalance()       // 123
a.balance            // 1000000
```

- surprising absence of familiar OOP keywords:
  - no `class`
  - no `this`
  - no `new`
- `balance` is *not* an object property!
  - `deposit` and `getBalance` *close over* `balance` instead
- Lisp programmers love this style
  - Other programmers... usually don't
- In practice, programmers either
  - just don't care about encapsulation that much, or
  - use `private` in TypeScript

### 2012 TypeScript

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

- This approach to encapsulation is very popular
  - Everybody knows `private` from some other language
- Note that `private` is only checked at compile-time
  - If you want to shoot yourself in the foot:

```ts
const a = new Account(123);

(a as any).balance = 1000000; // Well, if you insist...
```

### Closures + TypeScript

- When Lisp programmers write TypeScript:

```ts
function createAccount(balance: number) {
    return {
        deposit(amount: number): void {
            balance += amount;
        },

        getBalance(): number {
            return balance;
        },
    };
}

function f(account) {
           ///////
}
```

- How can they make `f` type-safe?
- What should the type of `account` be?
- Well, whatever `createAccount` returns:

```ts
type Account = ReturnType<typeof createAccount>;

function f(account: Account) {
           ////////////////
}
```
