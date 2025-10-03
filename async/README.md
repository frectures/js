## Asynchronous programming

- Language philosophy: JavaScript functions should *never* block waiting for I/O
- Unfortunately, `XMLHttpRequest` blocks when passed `false`:

```js
function getBlocking(xkcdNumber) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/${xkcdNumber}/info.0.json`, false); // synchronous
    xhr.send();
    const text = xhr.responseText;
    const json = JSON.parse(text);
    return json;
}

function showBlocking() {
    const animator = setInterval(() => log(Math.random()), 0);
    try {
        const json = getBlocking(927);
        log(json.transcript);
    } catch (error) {
        log(error);
    } finally {
        clearInterval(animator);
    }
}
```

- `getBlocking` prevents the animator from running at all
- The animator cannot even *start* before the function `showBlocking` returns
- Depending on the server delay, the browser may even suggest to kill the tab
- That's why JavaScript functions should *never* block waiting for I/O

### Callbacks

- Fortunately, `XMLHttpRequest` doesn't block when passed `true`:

```js
function getCalling(xkcdNumber, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/${xkcdNumber}/info.0.json`, true); // asynchronous
    xhr.onload = function () {
        const text = xhr.responseText;
        try {
            const json = JSON.parse(text);
            onSuccess(json);
        } catch (error) {
            onError(error);
        }
    }
    xhr.onerror = function () {
        onError(xhr.statusText);
    }
    xhr.send();
}

function showCalling() {
    const animator = setInterval(() => log(Math.random()), 0);
    getCalling(927, function (json) {
        log(json.transcript);
        clearInterval(animator);
    }, function (error) {
        log(error);
        clearInterval(animator);
    });
}
```

- `showCalling` returns swiftly, giving the animator time to run
- Additional indentation for every callback (“pyramid of doom” or “callback hell”)
- Code duplication
- Mandatory coding style for 20 years

### Promises

- Promises solve both problems of the previous approach:

```js
function getPromise(xkcdNumber) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest(); /////////// asynchronous
        xhr.open("GET", `/${xkcdNumber}/info.0.json`, true);
        xhr.onload = function () {
            const text = xhr.responseText;
            try {
                const json = JSON.parse(text);
                resolve(json);
            } catch (error) {
                reject(error);
            }
        }
        xhr.onerror = function () {
            reject(xhr.statusText);
        }
        xhr.send();
    });
}

function showPromise() {
    const animator = setInterval(() => log(Math.random()), 0);
    return getPromise(927)
    .then(json => log(json.transcript))
    .catch(error => log(error))
    .finally(() => clearInterval(animator));
}
```

- `fetch` returns a `Promise<Response>`:

```js
function showPromise() {
    const animator = setInterval(() => log(Math.random()), 0);
    return fetch("/927/info.0.json")
    .then(response => response.json())
    .then(json => log(json.transcript))
    .catch(error => log(error))
    .finally(() => clearInterval(animator));
}
```

- But the syntax looks weird, doesn't it?
- Basic language constructs are replaced with higher-order functions

### async/await

- async/await coats familiar syntax over Promises:

```js
async function showAsync() {
    const animator = setInterval(() => log(Math.random()), 0);
    try {
        const response = await fetch("/927/info.0.json");
        const json = await response.json();
        log(json.transcript);
    } catch (error) {
        log(error);
    } finally {
        clearInterval(animator);
    }
}
```

- Looks like synchronous code, but never blocks
- `await` actually *returns* from `showAsync` for later re-entry!
- Functions using `await` must be marked with the `async` keyword
- If you want to use `await` at top level, wrap the code in an IIFE:

```js
                                           // Immediately Invoked
(async function () { /* ... await ... */ })();
/////////// Function Expression ///////////
```
