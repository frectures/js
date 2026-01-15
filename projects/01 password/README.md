## Pwned passwords ⏰ Morning to Noon

> [Pwned Passwords](https://haveibeenpwned.com/Passwords) are hundreds of millions of passwords which have previously been exposed in data breaches.  
> [The Pwned Passwords API](https://haveibeenpwned.com/api/v3#PwnedPasswords) is freely accessible without the need for a subscription and API key.  

- Hash password, e.g. `monkey`:

```
$ echo -n monkey | sha1sum

ab87d24bdc7452e55738deb5f868e1f16dea5ace
^^^^^
```

- Access API with hash prefix:

```
$ curl --silent https://api.pwnedpasswords.com/range/ab87d
                                                     ^^^^^
00053631EAFD2BE219F81DAEA94666255B8:35
000AD0FE5189B088E6C1F61DA16528A45E1:1
006C09B0516629D89D177C5071BEEFC00C9:1
...
24788C6BFF67541DFAF37770C4514552452:2
24BDC7452E55738DEB5F868E1F16DEA5ACE:1501976
24CD2A4C020D50F4D3DCCCAB1369769B8C6:1
...
FF239B2C5818BBD179B440F51A5A28462B2:2
FF2A53BA92F2965C6034D229642CC7D7416:5
FF4C592C08155C34FDD9353B37B3A51602F:32
```

- Filter result with hash suffix:

```
$ curl --silent      https://api.pwnedpasswords.com/range/ab87d   \
| grep --ignore-case 24bdc7452e55738deb5f868e1f16dea5ace

24BDC7452E55738DEB5F868E1F16DEA5ACE:1501976
                                    ^^^^^^^
```

- i.e. `1501976` exposed accounts probably use `monkey` password
- But who wants to type `echo`, `sha1sum`, `curl`, `grep` manually?

### MVP

- Write a simple web application:
  - User enters password in a text field
  - User clicks button
  - Display how many exposed accounts use that password
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

### 🏆 Body chunks

- Is it **Noon** already?
  - Then skip to `projects/02 xkcd` now!
- api.pwnedpasswords.com sends large response bodies
  - Decoding after the hash of interest seems wasteful
- Response bodies can be decoded in chunks
  - This makes the code *much* more complex
  - **not** worth the tradeoff in practice!
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
