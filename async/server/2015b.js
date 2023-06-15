const http = require("http");
const fs   = require("fs/promises");

const server = http.createServer(requestListener);
server.listen(8080);

function requestListener(request, response) {
    console.log(request.url);
    let headerContent, fileContent;

    fs.readFile(__dirname + "/HEADER.txt")
    .then(content => {
        headerContent = content;
        return fs.readFile(__dirname + request.url);
    })
    .then(content => {
        fileContent = content;
        return fs.readFile(__dirname + "/FOOTER.txt");
    }/*, error => { throw error; } */)
    .then(footerContent => {
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
