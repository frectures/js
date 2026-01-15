## XKCD ⏰ Noon to Evening

![](https://imgs.xkcd.com/comics/standards.png)

### Dummy

- Write a web application that simply displays the image https://imgs.xkcd.com/comics/standards.png
- Add a `next` button that changes the image to https://imgs.xkcd.com/comics/mimic_octopus.png
- Add a `prev` button that changes the image to https://imgs.xkcd.com/comics/time_vulture.png

### CORS issue

- Where did those 3 image URLs come from?
- Study the result of https://xkcd.com/927/info.0.json (and 928 and 926) in the browser
- Unfortunately, the XKCD server won't allow `fetch("https://xkcd.com/927/info.0.json")` in your JavaScript code

### Install Node.js

- Open `cmd` on Windows (or `Terminal` on Macintosh)
- `node -v`
- If Node.js is not installed:
  - ⚠️ close the terminal
  - install Node.js from https://nodejs.org/en/download
  - ⚠️ open a new terminal

### Install http-server

- `cd "projects/02 xkcd"`
- `http-server -P https://xkcd.com`
- If http-server is not installed:
  - `npm install -g http-server`
  - `http-server -P https://xkcd.com`

### CORS issue solved

- Open `localhost:8080` in the browser
- In your JavaScript code, `fetch("/927/info.0.json")` instead of the full URL
- ⚠️ If `fetch` still has CORS issues:
  - Press `Ctrl F5` to clear cache
  - Open private tab
  - Try different browser
- Now make the `next` and `prev` buttons work multiple times in a row

### Big leaps

- Add a text field where the user can enter an arbitrary comic number to be loaded
- Which inputs are legal? How do you handle illegal inputs?
- `/info.0.json` without a preceding comic number results in the newest comic

### Three pics

- In addition to the current comic, the user should also see the previous and next comic
- Clicking on the previous and next *images* should have the same effect as clicking on the buttons
- You can remove the buttons if you want to
- How does your application behave if the current comic is the very first or last one?

### 404 Comic not found

- There is no XKCD comic number 404
- Account for this oddity in your code

### Ratings

- The user can rate the current comic with:
  - either 👍 and 👎
  - or with ★★★☆☆
- The user can clear a rating, in case they change their mind (or clicked by accident)
- Persist the ratings beyond page reloads with [localStorage](https://www.w3schools.com/jsref/prop_win_localstorage.asp):
  - `localStorage.setItem("someUniqueKey", someStringValue)`
  - `someStringValue = localStorage.getItem("someUniqueKey");`
- Write a second `.html` file that simply displays all well-rated comics
  - no buttons required
  - Both `.html` files share the same `localStorage`

### Optimization

- Perform the *initial* 3 requests concurrently
- Your code probably performs 3 requests on *every* button click
- Can you reduce the number of requests from 3 to 1 per mouse click?

### Off to the races

- Your optimized application probably behaves weirdly if you click very fast
- Why?
- Can you fix it?
