## XKCD

![](https://imgs.xkcd.com/comics/standards.png)

### MVP

- Write a web application that simply displays the image https://imgs.xkcd.com/comics/standards.png
- Add a `next` button that changes the image to https://imgs.xkcd.com/comics/mimic_octopus.png
- Add a `prev` button that changes the image to https://imgs.xkcd.com/comics/time_vulture.png

### CORS issue

- Now we want both buttons to work multiple times in a row
- Study the result of https://xkcd.com/927/info.0.json in the browser
- Unfortunately, the XKCD server won't allow `fetch("https://xkcd.com/927/info.0.json")` in your JavaScript code

### Install Node.js

- Open `cmd` on Windows (or `Terminal` on Macintosh)
- `node -v`
- If Node.js is not installed:
  - ⚠️ close the terminal
  - install Node.js from https://nodejs.org/en/download
  - ⚠️ open a new terminal

### Install http-server

- `cd projects/xkcd`
- `http-server -P https://xkcd.com`
- If http-server is not installed:
  - `npm install -g http-server`
  - `http-server -P https://xkcd.com`

### CORS issue solved

- Open `localhost:8080` in the browser
- In your JavaScript code, `fetch("/927/info.0.json")` instead of the full URL

### Big leaps

- Add a text field where the user can enter an arbitrary comic number to be loaded
- Which inputs are legal? How do you handle illegal inputs?
- `/info.0.json` without a preceding comic number results in the newest comic

### Three pics

- In addition to the current comic, the user should also see the previous and next comic
- Clicking on the previous and next *images* should have the same effect as clicking on the buttons
- You can remove the buttons if you want to
- How does your application behave if the current comic is the very first or last one?

### Optimization

- Your code probably performs 3 requests on every button click
- Can you reduce the number of requests from 3 to 1?

### Off to the races

- Your optimized application probably behaves weirdly if you click very fast
- Why?
- Can you fix it?
