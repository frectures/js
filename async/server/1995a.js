const http = require("http");
const fs   = require("fs");

const server = http.createServer(requestListener);
server.listen(8080);

function requestListener(request, response) {
    console.log(request.url);

    fs.readFile(__dirname + request.url, function (error, fileContent) {
        if (!error) {
            response.writeHead(200);
            response.end(fileContent);
        } else {
            console.log(error);
            response.writeHead(404);
            response.end(JSON.stringify(error));
        }
    });
}
