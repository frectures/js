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
  - Generators "return" each element separately for immediate consumption:

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
