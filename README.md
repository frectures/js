# JavaScript Basics

![](img/douglas.jpg)

> **Douglas Crockford:** “JavaScript is the only language (that I'm aware of) where people feel they don't need to learn it before using it.”

## History

- Main influences:
  - Scheme (Functions)
  - Self (Prototypes)
  - Java (Syntax)
  - Perl (Regex)
- Initial version “Mocha”
  - written during 10 days in May 1995
  - by Brendan Eich @ Netscape

```
         Mocha
          LiveScript
           JavaScript
           | (JScript)
           |  |   ES1 ES2  ES3                                     ES5                    ES6
           |  |   |   |    |                                       |                      |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---
93  94  95  96  97  98  99  00  01  02  03  04  05  06  07  08  09  10  11  12  13  14  15
  |   |   |             |       |         |   | |     |       |   |               |       |
  |   |   Internet      |       JSON      |   | Ajax  jQuery  |   Node.js     Electron.js |
  |   |   Explorer      XMLHTTP           |   |               |                           |
  |   |                                   |   Mozilla         Google                      Microsoft
  |   Netscape                            |   Firefox         Chrome                      Edge
  |   Navigator                           |
  |                                       Apple
  Mosaic                                  Safari
```

- Yearly releases since ECMAScript 2016 (ES7)

## Platforms

 ```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<link rel="stylesheet" href="pretty.css">

<script defer           src="bundle.js"></script>

</head>
<body>

<div style="display: flex">
    <textarea id="output" style="flex: 0px" rows="50"></textarea>
</div>

</body>
<script>

// ...
let response = await fetch("https://raw.githubusercontent.com/frectures/js/master/README.md");
let text     = await response.text();

document.getElementById("output").value = text;
// ...

</script>
</html>
```

- Browser (frontend)
  - HTML (*H*yper*T*ext *M*arkup *L*anguage)
  - CSS (*C*ascading *S*tyle *S*heets)
  - JS (*J*ava*S*cript)
  - DOM (*D*ocument *O*bject *M*odel)
- Node.js (backend)
  - JavaScript runtime environment built on Chrome's V8 JavaScript engine
  - High-performance, asynchronous server code
- Electron.js = Chromium + Node.js (cross-platform desktop applications)
  - Atom
  - Discord
  - Microsoft Teams
  - Skype
  - Visual Studio Code

## Type system

- Dynamically typed
- Primitive types
  1. `boolean`
     - `false`
     - `true`
  2. `number` (double precision floating point)
     - `0.1 + 0.2 === 0.30000000000000004`
     - `1.0 + 2.0 === 3.0`
     - Contains all integers up to 2<sup>53</sup> = `9_007_199_254_740_992`
  3. `bigint` (arbitrary precision integer)
     - `123n`
     - `BigInt(456)`
  4. `string` (UTF-16)
     - `"Ain't no sunshine"`
     - `'The cow says: "Moo"'`
     - `` `Frantic fans: "It's great!"` ``
     - `"🤨".length === 2`
       - UTF-16: `55358, 56616` (Java, C#, JavaScript)
       - UTF-8: `240, 159, 164, 168` (Go, Rust, Swift)
  5. `undefined` (mostly bugs)
     - uninitialized variables
     - function calls without return value
     - missing function arguments
     - missing object properties
     - array index out of bounds
  6. `null` (intentional absence)
- Reference types
  - `Object`
    - `Function`
    - `Array`
    - ...

> **Exercise:**
> - Visit https://frectures.github.io/jspad/
> - Copy/paste the program below
> - Execute the whole program via F5
> - Which logged types do you find surprising?

```js
log(typeof false);
log(typeof 3.14);
log(typeof 123n);
log(typeof "hello");
log(typeof "hello"[0]);
log(typeof undefined);
log(typeof null);
log(typeof {});
log(typeof Math.log);
log(typeof []);
```

![](img/refactoring.jpg)

> **Martin Fowler:** “Choosing JavaScript was deeply ironic for me, as many readers may know, I'm not a fan of it.
> It has too many awkward edge cases and clunky idioms.
> But the compelling reason for choosing it over Java is that JavaScript isn't wholly centered on classes.
> There are top-level functions, and use of first-class functions is common.
> This makes it much easier to show refactoring out of the context of classes.”

## Variables

- `var` variables have function scope:

```js
function f() {
    log(x); // undefined
    {
        log(x); // undefined

        var x = 42;

        log(x); // 42
    }
    log(x); // 42
}
```

- `let` variables have block scope:

```js
function f() {
    log(x); // ReferenceError: x is not defined
    {
        log(x); // ReferenceError: x is not defined

        let x = 42;

        log(x); // 42
    }
    log(x); // ReferenceError: x is not defined
}
```

- `const` requires initialization and forbids mutation of the variable:

```js
function f() {
    const uninitialized;     // SyntaxError: Missing initializer in const declaration

    const x = 42;
    x = 97;                  //   TypeError: Assignment to constant variable

    const account = new Account();
    account.deposit(42);     //        okay: mutates referenced object, not account variable

    account = new Account(); //   TypeError: Assignment to constant variable
}
```

## [Equality](https://stackoverflow.com/a/23465314)

- Type-safe equality via `===` and `!==` (compares type and value)

![](img/eqeqeq.png)

- Type-unsafe equality via `==` and `!=` (confusing type coercions)

![](img/eqeq.png)

- There is no universal `equals` method for object equality

## Control flow

```js
function releaseYearOfEcmaScript(version) {
    if (version < 1) throw new Error(`non-positive ECMAScript version ${version}`);
    //               /////
    switch (version) {
    //////
        case 1: return 1997;
        case 2: return 1998;
        case 3: return 1999;
        case 4: throw new Error("abandoned ECMAScript version 4");
        case 5: return 2009;

        default: return (version >= 2015) ? version : 2009 + version;
    }            //////                  ///       ///
}
```

> **Exercise:**
> - `releaseYearOfEcmaScript` handles some illegal inputs (such as 0 and 4)
> - Can you think of more illegal inputs to `releaseYearOfEcmaScript`?
> - Handle those illegal inputs as you see fit

### truthy/falsy values

- Technically, conditions are not restricted to `boolean` values:

```js
function f(value) {
    if (value) {
        return "truthy";
    } else {
        return "falsy";
    }
}

f(42)  // truthy
f( 0)  // falsy
f("0") // truthy
f("")  // falsy
```

- The following equivalent function explicitly lists all falsy values:

```js
function g(value) {
    const falsyValues = [ false, NaN, 0, -0, 0n, "", undefined, null ];

    return falsyValues.includes(value) ? "falsy" : "truthy";
}
```

- For the sake of maintenance, prefer `boolean` values in conditions

> **Exercise:**
> - Replace the array in function `g` with a `switch`
> - Is `g` still equivalent to `f`? Try all falsy values!

### Loops

```js
const s = "racecar";
for (let i = 0; i < s.length; ++i) {
    log(s[i]);
}


// find the smallest integer without odd successor

let x = 1;
while (x + 1 > x) {
    x *= 2;
    log(x);
}


// log all 6 permutations of 3 numbers,
// inspired by C++ std::next_permutation

const numbers = [ 1, 2, 3 ];
do {
    log(numbers);
    [ 1, 2, 3 ]
    [ 1, 3, 2 ]
    [ 2, 1, 3 ]
    [ 2, 3, 1 ]
    [ 3, 1, 2 ]
    [ 3, 2, 1 ]
} while (nextPermutation(numbers));
    [ 1, 2, 3 ]
```

> **Exercise:**
> - Start a loop at `x = 27` and transform `x` once per iteration:
>   - If `x` is even, divide `x` by 2
>   - If `x` is odd, multiply `x` by 3 and increment
>   - log `x` after every change
> - Stop the loop when `x` reaches 1
> - How many numbers were logged in total?

## Functions

![](img/sicpjs.webp)

### Arguments

- Every parameter is initialized with its corresponding argument:

```js
function join(array, separator, prefix, suffix) {

    return prefix + array[0] + separator + array[1] + suffix;
}

const treats = [ "peanuts", "chocolate", "pretzels" ];

join(treats, " and ", "Yummy: ", "!");
```

### Default arguments

- Missing arguments are `undefined`:

```js
// 2 indistinguishable calls:
join(treats, " and ");
join(treats, " and ", undefined, undefined);

// 2 indistinguishable calls:
join(treats);
join(treats, undefined, undefined, undefined);
```

- Manually replace `undefined` with sensible defaults:

```js
function join(array, separator, prefix, suffix) {

    if (separator === undefined) {
        separator = ", ";  // replace undefined 
    }

    prefix = prefix ?? ""; // replace null or undefined

    suffix = suffix || ""; // replace all falsy values

    return prefix + array[0] + separator + array[1] + suffix;
}
```

- Automatically replace `undefined` since ES2015:

```js
                               //////         ////         ////
function join(array, separator = ", ", prefix = "", suffix = "") {

    return prefix + array[0] + separator + array[1] + suffix;
}
```

### Named arguments

- JavaScript does not have named arguments
- But object literals `{ key: value, }` work just fine:

```js
function join(array, options) {

    return options.prefix + array[0] + options.separator + array[1] + options.suffix;
}

join(treats,
{
    prefix:    "Yummy: ",
    separator: " and ",
    suffix:    "!",
}); ///////////////
```

- The `join` signature does not reveal the available options
- Accessing every option with `options.` is quite cumbersome
- Mitigate both problems with *destructuring*:

```js
                     /////////////////////////////
function join(array, { prefix, separator, suffix }) {

    return prefix + array[0] + separator + array[1] + suffix;
}

join(treats,
{
    prefix:    "Yummy: ",
    separator: " and ",
    suffix:    "!",
});
```

- Default values must be handled manually:

```js
function join(array, { prefix, separator, suffix }) {

    prefix    = prefix    ?? "";
    separator = separator ?? ", ";
    suffix    = suffix    ?? "";

    return prefix + array[0] + separator + array[1] + suffix;
}

join(treats,
{
    separator: " and ",
});
```

> **Exercise:**
> - So far, `join` always joins 2 array elements
>   - Fix `join` so it joins `array.length` elements
>   - Does it work if `array.length` is 1 or 0?
> - 🏆 Are you worried that `str = str + something` in a loop may have quadratic complexity?
>   - Create a string of length 1 million via repeated concatenation of 1 character
>   - Measure the elapsed milliseconds with 2 `Date.now()` calls (before and after)
>   - Repeat the experiment with length 10 million
>   - Is it ~10 times slower? linear complexity
>   - Is it ~100 times slower? quadratic complexity

### Higher-order functions

- Higher-order functions accept (or return) other functions
- For example, `array.map(f)` applies `f` to all `array` elements:

```js
const primes = [ 2, 3, 5, 7 ];

function square(x) {
    return x * x;
}

primes.map(square);        // [ 4, 9, 25, 49 ]

primes.map(function (x) {  // [ 4, 9, 25, 49 ]
    return x * x;
});

primes.map((x) => x * x);  // [ 4, 9, 25, 49 ]

primes.map( x  => x * x);  // [ 4, 9, 25, 49 ]
```

- A custom `map` implementation could look like this:

```js
                   ///
function map(array, f) {
    const result = [];

    for (let i = 0; i < array.length; ++i) {
        result.push(f(array[i], i, array));
    }               /////////////////////

    return result;
}

map([ 2, 3, 5, 7 ], x => x * x); // [ 4, 9, 25, 49 ]
```

- Note how `map` passes 3 arguments to `f`
  - element, index, array
- But `x => x * x` defines only 1 parameter
  - JavaScript ignores extraneous arguments
- Other popular higher-order functions are `filter` and `reduce`:

```js
const primes = [ 11, 2, 3, 13, 5, 7, 17, 19 ];


function smallerThanTen(x) {
    return x < 10;
}

primes.filter(smallerThanTen); // [ 2, 3, 5, 7 ]

primes.filter(x => x < 10);    // [ 2, 3, 5, 7 ]


function plus(x, y) {
    return x + y;
}

primes.reduce(plus, 0);          // 0 + 11 + 2 + 3 + 13 + 5 + 7 + 17 + 19 = 77

primes.reduce((sumSoFar, currentNumber) => sumSoFar + currentNumber, 0); // 77
```

> **Exercise:**
> - Implement the custom `filter` function below
> - Implement the custom `reduce` function below

```js
function filter(array, predicate) {
    const result = [];

    // ...

    return result;
}

filter([ 11, 2, 3, 13, 5, 7, 17, 19 ], x => x < 10); // [ 2, 3, 5, 7 ]


function reduce(array, update, result) {
    // ...
}

reduce([ 11, 2, 3, 13, 5, 7, 17, 19 ], (x, y) => x + y, 0); // 77
```

![](img/chain.jpg)

## Objects

- In practice, you will encounter two “kinds” of objects:
  1. Object literals / JSON (*J*ava*S*cript *O*bject *N*otation)
  2. Class objects
- Technically, there is only 1 kind of object, but the whole truth is quite complicated

### Object literals / JSON

- A JavaScript object is essentially a `java.util.Map<String, Object>`

```js
// Object literal
const inventor = { forename: "Brandon", surename: "Eich" };

// read properties
inventor.forename              // 'Brandon'
inventor["surename"]           // 'Eich'

// write properties
inventor.forename = "Brendan"; // { forename: 'Brendan', surename: 'Eich' }
inventor["year"]  =  1961;     // { forename: 'Brendan', surename: 'Eich', year: 1961 }

// delete properties
delete inventor.forename;      // { surename: 'Eich', year: 1961 }
```

```js
// JSON
const str  = JSON.stringify(inventor); // '{"surename":"Eich","year":1961}'
const twin = JSON.parse(str);          //  { surename: 'Eich', year: 1961 }
```

- Quotation marks around keys are:
  - optional in literals
  - mandatory in JSON

![](img/array.jpg)

## Arrays

```js
const primes = [ 2, 3, 5, 7 ];
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

- JavaScript arrays are JavaScript objects with a special `length` property
  - The keys are stringified numbers
- The (mutable!) `length` property is the largest index +1
- There are no “array index out of bounds” errors:
  - Reading from such an index gives `undefined`
  - Writing to such an index grows the array

### Iteration

```js
const primes = [ 2, 3, 5, 7 ];


for (let i = 0; i < primes.length; ++i) {
    log(primes[i]);
}

                 //
for (const value of primes) {
    log(value);  // 2, 3, 5, 7
}

                 //
for (const index in primes) {
    log(index);  // '0', '1', '2', '3'
}


primes.forEach(function (value, index, array) {
    array[index] = -value;
});
```

### Sorting

- `array.sort()` sorts the elements by their `toString` value:

```js
const primes = [ 11, 2, 3, 13, 5, 7, 17, 19 ];

primes.sort();

               [ 11, 13, 17, 19, 2, 3, 5, 7 ]
```

- `array.sort(compare)` sorts the elements according to `compare`:

```js
primes.sort((a, b) => a - b);

               [ 2, 3, 5, 7, 11, 13, 17, 19 ]

primes.sort((a, b) => b - a);

               [ 19, 17, 13, 11, 7, 5, 3, 2 ]
```

| `compare(a, b)` | Order                      |
| --------------- | -------------------------- |
| negative        | `a` belongs *before* `b`   |
| positive        | `a` belongs *after* `b`    |
| zero            | `a` is *equivalent* to `b` |

```js
const inventors = ["Guido", "Bjarne", "James", "Brendan", "Anders"];

inventors.sort((a, b) => a.length - b.length);

["Guido",
 "James",
 "Bjarne",
 "Anders",
 "Brendan"]
```

- Since ES2019, equivalent elements retain their order

## Promises

```js
const url = "https://api.chucknorris.io/jokes/random";

fetch(url)  // result? blocking/asynchronous?
```

- Network traffic is slow
- JavaScript has no language-level threads
- `fetch` should not block JavaScript
- Asynchronous `Promise`s to the rescue:

<table>
<tr>
<th>ECMAScript 2015</th>
<th>ECMAScript 2017</th>
</tr>
<tr>
<td>

```js
function f() {
    return fetch(url)                   // Promise<Response>
    .then(response => response.text())  // Promise<string>
    .then(str      => JSON.parse(str))  // Promise<object>
    .then(joke     => log(joke));       // Promise<undefined>
}
```

</td>
<td>

```js
async function f() {
    const response = await fetch(url);      // Response
    const str      = await response.text(); // string
    const joke     =       JSON.parse(str); // object
    log(joke);                              // undefined
}
```

</td>
</tr>
</table>

- `fetch(url)` resolves when the response *header* arrives
  - The response *body* may still be downloading
- `response.text()` resolves when the body is:
  - downloaded
  - unzipped
  - converted to *string*
- `response.json()` resolves when the body is:
  - downloaded
  - unzipped
  - converted to *object*
  - 🚀 no intermediate string:

<table>
<tr>
<th>ECMAScript 2015</th>
<th>ECMAScript 2017</th>
</tr>
<tr>
<td>

```js
function f() {
    return fetch(url)                   // Promise<Response>
    .then(response => response.json())  // Promise<object>
    .then(joke     => log(joke));       // Promise<undefined>
}
```

</td>
<td>

```js
async function f() {
    const response = await fetch(url);       // Response
    const joke     = await response.json();  // object
    log(joke);                               // undefined
}
```

</td>
</tr>
</table>

- 📝 `async function`s implicitly return `Promise` objects

> **Exercise:**
> - Fetch all joke categories from `https://api.chucknorris.io/jokes/categories`
> - Ignore these controversial categories:
>   - explicit
>   - political
>   - religion
> - Fetch 1 joke per category from `https://api.chucknorris.io/jokes/random?category=insertCategoryHere`
> - Log the joke `value`s, sorted alphabetically
> - 🏆 Sort the jokes by `id` instead
> - 🏆 Fetch the jokes in parallel with [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
