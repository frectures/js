const http = require("http");
const fs   = require("fs/promises");

const server = http.createServer(requestListener);
server.listen(8080);

function requestListener(request, response) {
    console.log(request.url);

    const promises = [
        fs.readFile(__dirname + "/HEADER.txt"),
        fs.readFile(__dirname + request.url),
        fs.readFile(__dirname + "/FOOTER.txt"),
    ];
    Promise.all(promises)
    .then(([headerContent, fileContent, footerContent]) => {
        response.writeHead(200);
        response.write(headerContent);
        response.write(fileContent);
        response.end(footerContent);
    }, error => {
        console.log(error);
        response.writeHead(404);
        response.end(JSON.stringify(error));
    });
}
