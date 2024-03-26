# JavaScript Advanced

## Functions

### Closures

```js
function makeCounter() {
    let next = 1;

    return function () {
        return next++;
    };
}

const a = makeCounter();
const b = makeCounter();

console.log(a ()); // 1
console.log(a ()); // 2
console.log( b()); //  1
console.log(a ()); // 3
console.log( b()); //  2
console.log( b()); //  3
```

- Functions have access to their surrounding context
- Even after the enclosing function has returned!

> **Exercise:** Complete the function `makeFibonacci()`:

```js
function makeFibonacci() {
    // TODO initialize state

    return function () {
        // TODO update state
        // TODO return value
    };
}

const f = makeFibonacci();

console.log(f()); // 0
console.log(f()); // 1
console.log(f()); // 1
console.log(f()); // 2
console.log(f()); // 3
console.log(f()); // 5
console.log(f()); // 8
console.log(f()); // 13
console.log(f()); // 21
console.log(f()); // 34
console.log(f()); // 55
console.log(f()); // 89
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

console.log(generator.next());   // { value: 0n, done: false }
console.log(generator.next());   // { value: 1n, done: false }
console.log(generator.next());   // { value: 1n, done: false }
console.log(generator.next());   // { value: 2n, done: false }
console.log(generator.next());   // { value: 3n, done: false }
```

- Generator `function*`s return generator objects
- Generator objects are iterable:

```js
for (const value of fibonacci()) {
    if (value >= 1000) break;
    console.log(value);   // 0n 1n 1n 2n 3n 5n 8n 13n 21n 34n 55n 89n 144n 233n 377n 610n 987n
}
```

- Iterating over generator objects roughly desugars to:

```js
const generator = fibonacci();
let value, done;
while ({value, done} = generator.next(), !done) {
    if (value >= 1000) break;       // ^
    console.log(value);            //  comma operator
}
```

- Generators are stackless coroutines
- Implemented via state machines
  - Working C++ example:

```cpp
class Fibonacci {
    long a;
    long b;

    int state = 0;

public:
                    long next() {
switch (state) {
    case 0:             a = 0;
    state = 1;          return a;

    case 1:             b = 1;
    state = 2;          return b;

                        while (true) {
    case 2:                 a += b;
    state = 3;              return a;

    case 3:                 b += a;
    state = 4;              return b;

    case 4: ;           }
}                   }
};
```

> **Exercise:**
> - Write a generator function `divisors(x)` that yields all divisors of `x`
> - Write a function `isPerfectNumber(x)` that uses `divisors` and the `reduce` method
>   - The divisors of a perfect number add up to twice that number
>   - The first 4 perfect numbers are 6, 28, 496 and 8128

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
| `f.bind(obj)(x, y, z)`    | `obj`       |

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
- Hypothetical implementation if `bind` (2009) weren't built in:

```js
//                                       variadic function
Function.prototype.bind = function (obj, ...xs) {

    return (...ys) => this.call(obj, ...xs, ...ys);
    //      variadic function        spread operator
};
```

> **Exercise:**
> - The above `bind` implementation is a function returning an arrow function
> - Which other combination(s) could also (be made to) work?
>   - function returning function
>   - arrow function returning function
>   - arrow function returning arrow function

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
        //            spread operator
        const copy = [...this];
        copy.sort(compare);
        return copy;
    };
}
```

## Regular expressions

- Modelled after Perl regular expressions
- Literals `/\d+/g` enclosed by forward slashes with flags
  - `g`lobal
    - multiple search results
  - `i`gnore upper/lower case
  - `m`ultiline
    - `^` start of *line*
    - `$` end of *line*
- Conversion from string `new RegExp("\\d+", "g")`
- Methods discussed with use cases:
  - `regexp.test(string)`
  - `string.match(regexp)`
  - `regexp.exec(string)`
  - `string.matchAll(regexp)`

### Test containment

```js
/\d+/.test("There are 365 or 366 days in a year") // true
/\d+/.test("The earth rotates around the sun")    // false
```

### Test exact match

```js
/^\d+$/.test("There are 365 or 366 days in a year") // false
/^\d+$/.test("365") // true
```

### Find first occurrence

```js
"There are 365 or 366 days in a year".match(/\d+/) // [ '365' ]
   "The earth rotates around the sun".match(/\d+/) // null
```

### Find all occurrences

```js
"There are 365 or 366 days in a year".match(/\d+/g) // [ '365', '366' ]
   "The earth rotates around the sun".match(/\d+/g) // null
```

### Find all matches

```js
const dates = /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s+(\d{1,2})(?:st|nd|rd|th)?[,\s]\s*(\d{4})/gi;

// prior to ECMAScript 2020
function* allDatesIn(text) {
    let match;
    while ((match = dates.exec(text)) !== null) {
        yield { month: match[1], day: +match[2], year: +match[3] };
    }
}

// since ECMAScript 2020
function* allDatesIn(text) {
    for (const match of text.matchAll(dates)) {
        yield { month: match[1], day: +match[2], year: +match[3] };
    }
}

for (const date of allDatesIn(`
Brendan Eich was born on July 4th 1961.
Node.js was first released on May 27, 2009.
`)) {
    console.log(date); // { month: 'July', day: 4, year: 1961 }
}                      // { month: 'May', day: 27, year: 2009 }
```
