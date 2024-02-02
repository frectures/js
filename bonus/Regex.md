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
