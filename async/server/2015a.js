const http = require("http");
const fs   = require("fs/promises");

const server = http.createServer(requestListener);
server.listen(8080);

function requestListener(request, response) {
    console.log(request.url);

    fs.readFile(__dirname + request.url)
    .then(fileContent => {
        response.writeHead(200);
        response.end(fileContent);
    }, error => {
        console.log(error);
        response.writeHead(404);
        response.end(JSON.stringify(error));
    });
}
