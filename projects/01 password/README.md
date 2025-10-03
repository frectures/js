## Breached passwords

- `password` is a very commonly used password
- Its SHA-1 hash is `5BAA6` `1E4C9B93F3F0682250B6CF8331B7EE68FD8`
- https://api.pwnedpasswords.com/range/5BAA6 returns lots of lines, including:
  - `1E4C9B93F3F0682250B6CF8331B7EE68FD8:10382543`
  - meaning `10382543` breached accounts use `password`

### MVP

- Write a simple web application:
  - User enters password in a text field
  - User clicks button
  - Display how many breached accounts use that password
- The file `index.html` contains scaffolding to get you started
  - including example call of supplied `sha1hex` function
- Spoilers:
  - [input type](https://www.w3schools.com/tags/att_input_type.asp), [onclick](https://www.w3schools.com/jsref/event_onclick.asp)
  - [getElementById](https://www.w3schools.com/jsref/met_document_getelementbyid.asp), [value](https://www.w3schools.com/tags/att_input_value.asp)
  - [substr](https://www.w3schools.com/jsref/jsref_substr.asp) / [substring](https://www.w3schools.com/jsref/jsref_substring.asp)
  - [fetch](../../README.md#promises)
  - [split](https://www.w3schools.com/jsref/jsref_split.asp)
  - [div](https://www.w3schools.com/tags/tag_div.asp), [innerText](https://www.w3schools.com/jsref/prop_node_innertext.asp)

### History

- Instead of showing only the result for the most recently entered password, can you show a complete history?
- Sort the history
- What happens (should happen) if the user enters the same passwort multiple times?

### Usability

- Instead of clicking the button, pressing Enter in the text field should also work
- Automatically fire a request 2 seconds after every change to the text field
  - [setTimeout](https://www.w3schools.com/jsref/met_win_settimeout.asp)
- If the user types another symbol within the 2 seconds, cancel the prior request
  - [clearTimeout](https://www.w3schools.com/jsref/met_win_cleartimeout.asp)

### Quality

- How would you measure the intrinsic quality of a password?
  - password length
  - used alphabet
  - entropy?
  - ...
- Measure and display the password quality every time the text field changes

### Caching

| Password | SHA1                                          |
| -------- | --------------------------------------------- |
| monet    | `34580` `654ce86155ed31bb8e3a60fe9312703287d` |
| brixton  | `34580` `1faa8cbbaa684c3fd3c5705118fa52026e9` |
| scavenge | `5bced` `358484674c7c51eed8b9b925443a512cdef` |
| minkster | `5bced` `c318e8d5bce944ccf126d74358bb8caa6cf` |

- Suppose the user enters `monet`, `scavenge`, `brixton`, `minkster` in that order
  - `monet` should fire a request
  - `scavenge` should fire a request
  - `brixton` should not
  - `minkster` should not
- 🏆 Can you find more collisions?
  - [xato-net-10-million-passwords.txt](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/xato-net-10-million-passwords.txt)
  - Use the language you're most familiar/comfortable with
  - If you absolutely want to use JavaScript instead, [install Node.js](https://nodejs.org/en/download) and take it from here:

```js
// Save this file as whatever.js
// and run it from the terminal:
// node whatever.js

const fs = require("fs");

fs.readFile("xato-net-10-million-passwords.txt", "utf8", function (error, data) {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});
```

### 🏆 Body chunks

- api.pwnedpasswords.com sends large response bodies
  - Decoding after the hash of interest seems wasteful
- Response bodies can be decoded in chunks
  - This makes the code *much* more complex though
  - *NOT* worth the tradeoff in practice!
- Still interesting and fun, though:

```js
const response = await fetch(url);
let count = 0;

for await (const chunk of response.body.pipeThrough(new TextDecoderStream("utf-8"))) {

    log(++count, chunk.length, chunk.substring(0, 10)); // Observe the logs carefully!

    // ...
    if (hashFound) {
        // ...
        return numberAfterColon; // stop decoding
    }
}
```

- ⚠️ Chunks can end in the middle of a line!
  - Why is that a problem?
  - How do you solve it?
- Much harder without `async`/`await` btw:

```js
return fetch(url).then(response => {
    let count = 0;
    
    const reader = response.body.pipeThrough(new TextDecoderStream("utf-8")).getReader();
    
    function step() {
        return reader.read().then(status => {
            if (!status.done) {
                const chunk = status.value;

                log(++count, chunk.length, chunk.substring(0, 10)); // Observe the logs carefully!

                // ...
                if (hashFound) {
                    // ...
                    return numberAfterColon; // stop decoding
                } else {
                    return step();       // continue decoding
                }
            }
        });
    }

    return step();
});
```
