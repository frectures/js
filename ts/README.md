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
  - `never` (function always `throw`s exception)
  - `any` (disable type-checking)
  - `unknown` (force cast before use)

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

> **Exercise:** Convert `projects/01 password` from JavaScript to TypeScript

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
