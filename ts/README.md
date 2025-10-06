# TypeScript

```ts
function welcome(users: string[]): void {

    const sortedUsers: string[] = users.toSorted();

    sortedUsers.forEach((user: string) => {
        console.log(`Hello ${user} of length ${user.length}!`);
    });
}

welcome(["Brendan", "Douglas", "Anders"]);
```

- TypeScript is a statically typed superset of JavaScript
- Browsers do *not* understand TypeScript (yet?)
- TypeScript is compiled to JavaScript by removing the types:

```js
function welcome(users) {
    const sortedUsers = users.toSorted();

    sortedUsers.forEach((user) => {
        console.log(`Hello ${user} of length ${user.length}!`);
    });
}

welcome(["Brendan", "Douglas", "Anders"]);
```

## Using TypeScript

### Online Playground

https://www.typescriptlang.org/play

### Node demo

```
C:\Users\fred\git\js\ts> npm install
```

| Compilation mode                | Command                                    |
| ------------------------------- | ------------------------------------------ |
| compile once now, then exit     | `C:\Users\fred\git\js\ts> npx tsc`         |
| compile every time files change | `C:\Users\fred\git\js\ts> npx tsc --watch` |

## Type system

### Primitive types

- from JavaScript
  - `boolean`
  - `number`
  - `bigint`
  - `string`
  - `undefined`
  - `null`
- TypeScript only
  - `void` (function returns without `return`)
  - `any` (disable type-checking)
  - `unknown` (force cast before use)
  - `never` (function always `throw`s exception, see below)

```ts
let l; // l: any

if (x >= 0) {
    l = Math.sqrt(x);
} else {
    throw new Error("TODO: handle negative numbers");
}
    l; // l: number
```

```ts
const c = (x >= 0) ? Math.sqrt(x) : throw new Error("TODO: handle negative numbers");
                                    /////
                                    // expression expected
```

```ts
function TODO(message: string): void {
                                ////
    throw new Error(`TODO: ${message}`);
}

const v = (x >= 0) ? Math.sqrt(x) : TODO("handle negative numbers");

      v; // v: number | void
```

```ts
function TODO(message: string): never {
                                /////
    throw new Error(`TODO: ${message}`);
}

const n = (x >= 0) ? Math.sqrt(x) : TODO("handle negative numbers");

      n; // n: number
```

### Union types

- Combine multiple *types* in an either-or fashion:

```ts
function sumOf(hmm: number | number[]): number {
    if (typeof hmm === "number") {
        return hmm;
    } else {
        return hmm.reduce((result, element) => result + element, 0);
    }
}

sumOf(42)       // 42

sumOf([1, 2, 3]) // 6
```

- Combine multiple *values* in an either-or fashion:

```ts
function flipCoin(): "heads" | "tails" {
    if (Math.random() < 0.5) {
      return "heads";
    } else {
      return "tails";
    }
}
```

### Interfaces

- https://api.chucknorris.io/jokes/random

```js
{
  "categories": [],
  "created_at": "2020-01-05 13:42:21.179347",
  "icon_url": "https://api.chucknorris.io/img/avatar/chuck-norris.png",
  "id": "1tyjMolxSzGpcyHrjwbsuw",
  "updated_at": "2020-01-05 13:42:21.179347",
  "url": "https://api.chucknorris.io/jokes/1tyjMolxSzGpcyHrjwbsuw",
  "value": "Chuck Norris' birthday is on the 29th of Febuary...every year!"
}
```

- Define properties of interest with an interface:

```ts
interface Joke {
    id: string,
    url: string,
    value: string,
}
```

- Either declare variable of type `Joke`:

```ts
const response = await fetch("https://api.chucknorris.io/jokes/random");
const json: Joke = await response.json();
          //////
```

- Or cast expression to `Joke`:

```ts
const response = await fetch("https://api.chucknorris.io/jokes/random");
const json = await response.json() as Joke;
                                   ///////
```

- Now `json.` pops up autocompletion
- And `json.fred` warns:
  - `Property 'fred' does not exist on type 'Joke'`

> **Exercise:**
> - Convert `projects/01 password` from JavaScript to TypeScript:
>   - Copy `.js` files from `projects/01 password/` to `ts/src/`
>   - Rename the new `.js` files to `.ts`
>   - Copy `index.html` from `projects/01 password/` to `ts/`
>   - Change import from `"./index.js"` to `"./out/index.js"`
> - Open a terminal inside the `ts/` folder
> - Run `npm install` to install the TypeScript compiler
> - Run `npx tsc --watch` to start the TypeScript compiler
>   - The compiler will report lots of missing types
>   - But `localhost:8080` should still work
> - Add the missing types inside `sha1.ts`:
>   - `function sha1hex(str: string): string`
>   - `function rotateLeft(x: number, n: number): number`
>   - `function hex32(x: number): string`
> - Add the missing types inside `index.ts`
> - All `document.getElementById("...").property` accesses are problematic
>   - because the compiler cannot possibly know whether those elements will exist (and what properties they will have)
>   - Fix `Property 'value' does not exist on type 'HTMLElement'` by casting: `(document.getElementById("textInput") as HTMLInputElement).value`
>   - Fix `Object is possibly 'null'` with an exclamation mark: `document.getElementById("textInput")!.onkeyup`

### Generics

- filter numbers:

```ts
                              ////////                  //////               ////////
function filterNumbers(array: number[], good: (element: number) => boolean): number[] {
                  ////////
    const result: number[] = [];
    for (const x of array) {
        if (good(x)) {
            result.push(x);
        }
    }
    return result;
}

const primes = [2, 3, 5, 7, 11, 13, 17, 19];

const smallPrimes = filterNumbers(primes, (p) => p < 10);
```

- filter strings:

```ts
                              ////////                  //////               ////////
function filterStrings(array: string[], good: (element: string) => boolean): string[] {
                  ////////
    const result: string[] = [];
    for (const x of array) {
        if (good(x)) {
            result.push(x);
        }
    }
    return result;
}

const tongueTwister = ["she", "sells", "sea", "shells", "by", "the", "sea", "shore"];

const threeLetterWords = myFilter(tongueTwister, (s) => s.length === 3);
```

- generic filter:

```ts
                      ///        ///                 //               ///
function genericFilter<T>(array: T[], good: (element: T) => boolean): T[] {
                  ///
    const result: T[] = [];
    for (const x of array) {
        if (good(x)) {
            result.push(x);
        }
    }
    return result;
}

const smallPrimes = genericFilter(primes, (p) => p < 10);

const threeLetterWords = genericFilter(tongueTwister, (s) => s.length === 3);
```

> **Exercise:**
> - Add generics to `genericMap`
> - Add generics to `genericReduce`

```ts
function genericMap (array, f) {
    const result = [];
    for (const x of array) {
        result.push(f(x));
    }
    return result;
}

const squares = genericMap(primes, (p) => p * p);

const wordLenghts = genericMap(tongueTwister, (s) => s.length);
```

```ts
function genericReduce (array, f, result) {
    for (const x of array) {
        result = f(result, x);
    }
    return result;
}

const sum = genericReduce(primes, (result, element) => result + element, 0);

const sentence = genericReduce(tongueTwister, (result, element) => result.concat(element), "");
```
