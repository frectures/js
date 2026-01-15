const http = require("http");
const fs   = require("fs/promises");

const server = http.createServer(requestListener);
server.listen(8080);

async function requestListener(request, response) {
    console.log(request.url);
    try {
        const fileContent = await fs.readFile(__dirname + request.url);
        response.writeHead(200);
        response.end(fileContent);
    } catch (error) {
        console.log(error);
        response.writeHead(404);
        response.end(JSON.stringify(error));
    }
}
