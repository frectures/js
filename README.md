# Introduction to JavaScript

## History

![](img/eich.jpg)

* Designed and implemented as *LiveScript* over 10 days in 1995 by Brendan Eich at Netscape
* Main influences:
  * Scheme (Functions)
  * Self (Prototypes)
  * Java (Syntax)
  * Perl (Regular expressions)
* Released in 1996 as *JavaScript*&trade; for marketing purposes
* Standardized as *EcmaScript* in 1997
* Long version gap between 2005 and 2015
  * Time for browser implementers to catch up
  * AJAX revolution
  * Node.js
* Yearly releases since 2015 (ES6)

## Asynchronous programming

```java
// Java: blocking wait
try {
    System.out.println("I. start");
    Thread.sleep(1000);
    System.out.println("II. 1 second later");
} catch (InterruptedException ex) {
    Thread.currentThread().interrupt();
}
```
```js
// JavaScript: non-blocking wait
console.log("I. start");
setTimeout(function () {
    console.log("III. 1 second later");
}, 1000);
console.log("II. 1 µs later");
```
```java
// Java: see Swing ActionListener
System.out.println("I. start");
button.addActionListener(event -> {
    System.out.println("III. much later");
});
System.out.println("II. 1 µs later");
```

![](img/queue.svg)

* The JavaScript programming language has no threads
  * A single call stack for JavaScript functions
  * JavaScript functions are never interrupted
  * Long-running functions freeze the UI
  * Infinite loops block everything:
```js
setTimeout(() => {
    // You will never see this message:
    console.log("A miracle!");
}, 0);
while (true) {
    // because control flow is stuck in an infinite loop.
}
```
* Significantly reduced language complexity
  * Absence of "memory model" (regulates inter-thread memory visibility)
  * Race conditions and deadlocks are non-issues
* (Compute-intensive parallelism via Web workers)
* Asynchronous IO via non-blocking APIs accepting callbacks
  * Registered callbacks are eventually called from the event loop:

```js
// GROSSLY OVERSIMPLIFIED implementation in pseudo Java

var queue = new LinkedBlockingQueue<Runnable>();

void eventLoop() {
    while (true) {
        Runnable callback = queue.take(); // BLOCKING dequeue
        callback.run();                   // BLOCKING call

        DocumentObjectModel.render();
    }
}

var threadPool = Executors.newFixedThreadPool(1024);

void setTimeout(Runnable callback, int delay) {
    threadPool.execute(() -> {
        Thread.sleep(delay);
        queue.put(callback);
    });
}
```

## Platforms

 ```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link     rel="stylesheet"     href="pretty.css">
<script  type="text/javascript" src="jquery-3.5.1.js"></script>
<script  type="text/javascript">

$.get("README.md")
.done(function (data, textStatus, jqXHR) {
    console.log("success!");
    document.getElementById("output").value = data;
})
.fail(function (jqXHR, textStatus, errorThrown) {
    console.log("error!");
    document.querySelector("#output").value = `${textStatus} ${jqXHR.status}`;
});
console.log("http request sent...");

</script>
</head>
<body>

<div style="display: flex">
    <textarea id="output" style="flex: 0px" rows="50">Fetching content...</textarea>
</div>

</body>
</html>
```

* Browser (frontend)
  * Trinity: HTML, CSS and JS
  * Form validation
  * DOM manipulation
  * Full-blown web applications
* Node.js (backend)
  * Asynchronous server code
  * Better live experience during development

```js
const fs   = require("fs");
const http = require("http");

function requestListener(request, response) {
    fs.readFile(__dirname + request.url, function (error, data) {
        if (error) {
            console.log("error!");
            response.writeHead(404);
            response.end(JSON.stringify(error));
        } else {
            console.log("success!");
            response.writeHead(200);
            response.end(data);
        }
    });
    console.log("file content requested...");
}

const server = http.createServer(requestListener);
server.listen(8080);
```

* Electron = Chromium + Node.js (cross-platform desktop applications)
  * Atom
  * Discord
  * Microsoft Teams
  * Skype
  * Visual Studio Code

## Type system

* Dynamically typed
* Primitives
  1. `undefined`
     * uninitialized variables
     * function calls without return value
     * missing function arguments
     * missing object properties
     * array index out of bounds
  2. `boolean`
     * `false`
     * `true`
  3. `number` (double precision floating point)
     * `0.1 + 0.2 == 0.30000000000000004`
     * Contains all integers up to `9_007_199_254_740_992` (9 quadrillion, 9 Billiarden)
  4. `bigint` (arbitrary precision integer)
     * `123n`
     * Supports the same operators as double, except `>>>`
  5. `string` (UTF-16)
     * `"Ain't No Sunshine"`
     * `'The Cow Says: "Moo!"'`
  6. `null`
* `Object`
  * `Function`
  * `Array`
  * `RegExp`
  * ...

### The `typeof` operator

```js
typeof undefined === "undefined"
typeof false     === "boolean"
typeof 3.14      === "number"
typeof 123n      === "bigint"
typeof "hello"   === "string"
typeof "hi"[0]   === "string"
typeof null      === "object"

typeof {}        === "object"
typeof log       === "function"
typeof []        === "object"
[].constructor   === Array
```

## Variables

* `var` variables have function scope:

```js
function f() {
    // scope of x starts here
    // ...
    {
        // ...
        var x = 42;
        // ...
    }
    // ...
}   // scope of x ends here
```

* `let` variables have block scope:

```js
function f() {
    // ...
    {
        // ...
        let x = 42;
        // scope of x starts here
        // ...
    }   // scope of x ends here
    // ...
}
```

* `const` requires initialization and forbids assignment:

```js
function f() {
    const uninitialized; // error: const requires initialization

    const x = 42;
    x = 97;              // error: const forbids assignment

    const account = new Account();
    account.deposit(42);     //    ok: method call is not assignment
    account = new Account(); // error: const forbids assignment
}
```

## Equality

https://stackoverflow.com/a/23465314

* Type-safe equality via `===` and `!==` (compares type and value)

![](img/eqeqeq.png)

* Type-unsafe equality via `==` and `!=` (confusing type coercions)

![](img/eqeq.png)

* There is no universal `equals` method for object equality

## Truthy vs. falsy values

```js
function probe(x) {
    if (x) {
        console.log("truthy");
    } else {
        console.log("falsy");
    }
}

probe(undefined); // falsy
probe(false);     // falsy
probe(+0.0);      // falsy
probe(-0.0);      // falsy
probe(NaN);       // falsy
probe(0n);        // falsy
probe("");        // falsy
probe(null);      // falsy
```

* All other values are considered truthy

## Control flow

### Conditionals

```js
let coin;
if (Math.random() < 0.5) {
    coin = "heads";
} else {
    coin = "tails";
}

const coin = Math.random() < 0.5 ? "heads" : "tails";
```

### switch/case

```js
switch (expression) {
    case 42: // ...
    break;

    case "hello": // ...
    break;

    case true: // ...
    break;

    case f(): // ...
    break;

    default: // ...
}
```

### Loops

```js
for (let i = 0; i < s.length; ++i) {
    console.log(s[i]);
}

let node = root;
while (node.leftChild) {
    node = node.leftChild;
}

let password;
do {
    password = readPassword();
} while (password !== "Simsalabim");
```

### Exceptions

```js
try {
    // ...
} catch (ex) {
    // ...
} finally {
    // ...
}
```

* A single `catch` block catches all exceptions
* At least one of `catch` and `finally` must be present
* All JavaScript values, including primitives, can be thrown

```js
throw null;
throw undefined;
throw true;
throw 42.0;
throw "string literal";

throw new Error("error object");

throw { message: "object literal" };

throw function () { };
```

## Functions

```js
// ReferenceError: Cannot access 'min' before initialization
console.log(min(3, 4));

// ReferenceError: Cannot access 'max' before initialization
console.log(max(3, 4));

// TypeError: arithmeticMean is not a function
console.log(arithmeticMean(3, 4));

// 5
console.log(geometricMean(3, 4));


let min = function (x, y) {
    return x < y ? x : y;
};

const max = function (x, y) {
    return x > y ? x : y;
};

var arithmeticMean = function (x, y) {
    return (x + y) / 2;
};

function geometricMean(x, y) {
    return Math.sqrt(x * x + y * y);
}
```

* Missing arguments are initialized to `undefined`
* Extra arguments are ignored

### Higher-order functions

```js
function fixCos() {
    let x = 0;
    let y = Math.cos(x);

    while (y !== x) {
        console.log(x);
        x = y;
        y = Math.cos(x);
    }
    return x;
}

fixCos() // 0.7390851332151607


function fixSqrt() {
    let x = 0.5;
    let y = Math.sqrt(x);

    while (y !== x) {
        console.log(x);
        x = y;
        y = Math.sqrt(x);
    }
    return x;
}

fixSqrt() // 0.9999999999999999


function fix(f, x) {
    let y = f(x);

    while (y !== x) {
        console.log(x);
        x = y;
        y = f(x);
    }
    return x;
}

fix(Math.cos,  0)   // 0.7390851332151607
fix(Math.sqrt, 0.5) // 0.9999999999999999
```

* Functions are first class, hence functions can be:
  * passed as arguments
  * returned as results
  * stored in properties

### Closures

```js
let hello = function (user) {
    return "Hello, " + user + "!";
};

hello("Fred") // "Hello, Fred!"


let goodbye = function (user) {
    return "Goodbye, " + user + "!";
};

goodbye("Fred") // "Goodbye, Fred!"


function greet(prompt) {
    return function (user) {
        return prompt + ", " + user + "!";
    };
}

hello = greet("Hello");
goodbye = greet("Goodbye");
```

* Functions have access to their surrounding context
  * Even after the enclosing function has returned!

### Variadic functions

```js
function logs(...xs) {
    for (const x of xs) {
        console.log(x);
    }
}

logs(42, "hello world", true);
```

### Generator functions

```js
function* fibonacciSequence() {
    let a = 0n;
    let b = BigInt(1);
    while (true) {
        yield a;
        const c = a + b;
        a = b;
        b = c;
    }
}

for (const fibonacciNumber of fibonacciSequence()) {
    console.log(fibonacciNumber);
}
```

* `function*`s are stackless coroutines
  * implemented via state machines
  * similar to C# generators
  * automatic Babel translation to ES5:

```js
var _marked = /*#__PURE__*/regeneratorRuntime.mark(fibonacciSequence);

function fibonacciSequence() {
  var a, b, c;
  return regeneratorRuntime.wrap(function fibonacciSequence$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          a = 0n;
          b = BigInt(1);

        case 2:
          if (!true) {
            _context.next = 10;
            break;
          }

          _context.next = 5;
          return a;

        case 5:
          c = a + b;
          a = b;
          b = c;
          _context.next = 2;
          break;

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
```

## Objects

```js
// object literal
const inventor = { surname: "Eich", forename: "Brendan" };

// lookup properties
inventor.forename    // 'Brendan'
let key = "surname";
inventor[key]        // 'Eich'

// add properties
inventor.age = 59;            // { surname: 'Eich', forename: 'Brendan', age: 59 }
key = "language";
inventor[key] = "JavaScript"; // { surname: 'Eich', forename: 'Brendan', age: 59, language: 'JavaScript' }

// remove property
delete inventor.forename;     // { surname: 'Eich', age: 59, language: 'JavaScript' }
```

* JavaScript objects are essentially `java.util.HashMap<String, Object>`
* Quotation marks around keys in object literals are optional
* Properties are accessed directly after dot, or indirectly inside brackets
* Objects are class-free, properties can be added and removed at will

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

### Common prototype for methods

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

* Property lookup `o.x` starts at the object and goes up the prototype chain:
  * `o.x`
  * `o.__proto__.x`
  * `o.__proto__.__proto__.x`
  * `o.__proto__.__proto__.__proto__.x`
  * etc.

### Constructor functions

```js
function Account(initialBalance, accountId) {
    this.balance = initialBalance;
    this.id = accountId;

    this.deposit = function (amount) {
        this.balance += amount;
    };

    this.getBalance = function () {
        return this.balance;
    };
}

             // Account.call({}, 1000, 42)
const account = new Account(1000, 42);
// Account { balance: 1000, id: 42, deposit: [Function (anonymous)], getBalance: [Function (anonymous)] }
account.deposit(234);
account.getBalance() // 1234

createAccount(1234, 42).getBalance === account.getBalance // false
```

* By convention, functions starting with an uppercase letter are *constructor functions*

### Function prototype property

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

              // Account.call({ __proto__: Account.prototype }, 1000, 42)
const account = new Account(1000, 42);
// Account { balance: 1000, id: 42 }
account.__proto__
// { deposit: [Function (anonymous)], getBalance: [Function (anonymous)] }
account.deposit(234);
account.getBalance() // 1234

createAccount(1234, 42).getBalance === account.getBalance // true
```

* *Every* function has an associated `prototype` property
  * But it's only useful for constructor functions

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
account.__proto__
// {}
account.__proto__ === Account.prototype // true
account.__proto__.deposit               // [Function: deposit]
account.__proto__.getBalance            // [Function: getBalance]
```

* JavaScript has no runtime notion of classes
* The `class` keyword merely coats syntactic sugar over the prototype system
* Arguably the most controversial feature in ES6
  * Java programmers love it
  * JavaScript programmers hate it

> **Douglas Crockford:** `class` was the most requested new feature in JavaScript.
> All of the requests came from Java programmers who have to program in JavaScript and don't want to have to learn how to do that.
> They wanted something that looks like Java so that they could be more comfortable.
>
> [Nordic.js 2014 • Douglas Crockford - The Better Parts](https://www.youtube.com/watch?v=PSGEjv3Tqo0&t=315)

* Douglas Crockford promotes OOP without classes and prototypes:

```js
// simulate named arguments via object destructuring
function createAccount({ initialBalance, accountId }) {
    let balance = initialBalance || 0;
    const id = accountId || 0;

    //     shorthand for { deposit: deposit, getBalance: getBalance }
    return Object.freeze({ deposit, getBalance });

    function deposit(amount) {
        balance += amount;
    }

    function getBalance() {
        return balance;
    }
}

const account = createAccount({ initialBalance: 1000, accountId: 42 });
// { deposit: [Function: deposit], getBalance: [Function: getBalance] }
account.deposit(234);
account.getBalance() // 1234
account.balance      // undefined

createAccount(1234, 42).getBalance === account.getBalance // false
```

* Encapsulation
* Frozen interface
* Much simpler language without:
  * `this`
  * `new`
  * `prototype`
  * `__proto__`
  * `constructor`
  * `class`
* Increased memory usage
* Looks alien to Java programmers

## Arrays

```js
const primes = [2, 3, 5, 7];
typeof primes                      // 'object'
Object.getOwnPropertyNames(primes) // [ '0', '1', '2', '3', 'length' ]

primes.length // 4
primes[0]     // 2
primes[4]     // undefined

primes[4] = 11;      // [ 2, 3, 5, 7, 11 ]
primes.push(13);     // [ 2, 3, 5, 7, 11, 13 ]
primes.push(17, 19); // [ 2, 3, 5, 7, 11, 13, 17, 19 ]
primes[24] = 97;     // [ 2, 3, 5, 7, 11, 13, 17, 19, <16 empty items>, 97 ]
primes.length = 5;   // [ 2, 3, 5, 7, 11 ]
primes.pop();        // [ 2, 3, 5, 7 ]
```

* JavaScript arrays are JavaScript objects with a special `length` property
  * The keys are stringified numbers
* The (mutable!) `length` property is the largest index +1
* There are no "array index out of bounds" errors:
  * Reading from such an index gives `undefined`
  * Writing to such an index grows the array

### Iteration

```js
for (let i = 0; i < primes.length; ++i) {
    console.log(primes[i]);
}

primes.forEach(function (element, index, array) {
    console.log(element);
});

for (const p of primes) {
    console.log(p);
}
```

### Sorting

```js
// sort elements by their toString representation
primes.sort();
// [ 11, 13, 17, 19, 2, 3, 5, 7 ]

// sort elements by their numeric value
primes.sort(function (a, b) { return a - b; });
// [ 2, 3, 5, 7, 11, 13, 17, 19 ]
```

## Nested functions and `this`

```js
class Account {
    // ...

    depositMultiple(amounts) {
        amounts.forEach(function (amount) {
            // TypeError: Cannot read property 'deposit' of undefined
            this.deposit(amount);
        });
    }
}

// possible implementation of forEach
Array.prototype.forEach = function (f) {
    for (let i = 0; i < this.length; ++i) {
        f(this[i]);
    }
};
```

* `f(this[i]);` inside `forEach` is a function call, *not* a method call
  * Hence inside `f`, `this` is `undefined`, and unrelated to the outer `this`
* There are 3 solutions to this problem:

### 1. Copy `this` into `that`

```js
        const that = this;
        amounts.forEach(function (amount) {
            that.deposit(amount);
        });
```

### 2. `bind` to `this`

```js
        amounts.forEach(function (amount) {
            this.deposit(amount);
        }.bind(this));

// possible implementation of bind
Function.prototype.bind = function (receiver) {
    const that = this;
    return function (...xs) {
        return that.apply(receiver, xs);
    };
};
```

### 3. Arrow functions

```js
        amounts.forEach(amount => {
            this.deposit(amount);
        });

// alternative implementation of bind
Function.prototype.bind = function (receiver) {
    return (...xs) => this.apply(receiver, xs);
};
```

* Arrow functions do not have their own `this`
* Great fit for higher-order functions

## Spread operator

```js
const temp   = [3, 5, 7];
const odds   = [1, ...temp, 9];  // [1, 3, 5, 7, 9]
const primes = [2, ...temp, 11]; // [2, 3, 5, 7, 11]

const birthday = { day: 4, month: 7, year: 1961 };
const celebrate = {     ...birthday, year: 2021, age: 60 }; // { day: 4, month: 7, year: 2021, age: 60 }


function compose(f, g) {
    return function (...xs) {   // variadic function
        return f(g(...xs));     // spread operator
    };
}

function curry(f, ...xs) {      // variadic function
    return function (...ys) {   // variadic function
        return f(...xs, ...ys); // spread operators
    };
}

Function.prototype.bind = function (receiver, ...xs) {
    return (...ys) => this.call(receiver, ...xs, ...ys);
};
```

## Regular expressions

* Modelled after Perl regular expressions
* Literals `/\d+/g` enclosed by forward slashes with flags
  * `g`lobal
    * multiple search results
  * `i`gnore upper/lower case
  * `m`ultiline
    * `^` start of *line*
    * `$` end of *line*
* Conversion from string `new RegExp("\\d+", "g")`
* Methods discussed with use cases:
  * `regexp.test(string)`
  * `string.match(regexp)`
  * `regexp.exec(string)`
  * `string.matchAll(regexp)`

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

function* allDatesIn(text) {
    let match;
    while ((match = dates.exec(text)) !== null) {
        yield { month: match[1], day: +match[2], year: +match[3] };
    }
}

for (const date of allDatesIn(`
Brendan Eich was born on July 4th 1961.
Node.js was first released on May 27, 2009.
`)) {
    console.log(date); // { month: 'July', day: 4, year: 1961 }
}                      // { month: 'May', day: 27, year: 2009 }

function* allDatesIn2020(text) {
    for (const match of text.matchAll(dates)) {
        yield { month: match[1], day: +match[2], year: +match[3] };
    }
}
```
