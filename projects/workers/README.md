## Web workers

- Normally, all JavaScript functions run on the same thread
  - `async` functions give up control at `await` points
  - Asynchrony is *not* concurrency or parallelism
- In contrast, every web worker runs on its own thread
  - always concurrently
  - potentially in parallel, depending on `navigator.hardwareConcurrency`
- `password.html` and `sha1.js` demonstrate how to:
  - create web workers, and
  - communicate via message passing
  - ⚠️ `new Worker("somefile.js")` requires the project to be served by Node.js `http-server` or similar (see `"projects/02 xkcd"`)
- `benoit.html` could benefit from web workers because it is computationally expensive
  - Split the computation among `navigator.hardwareConcurrency` web workers
