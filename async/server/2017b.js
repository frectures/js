const http = require("http");
const fs   = require("fs/promises");

const server = http.createServer(requestListener);
server.listen(8080);

async function requestListener(request, response) {
    console.log(request.url);
    try {
        const headerContent = await fs.readFile(__dirname + "/HEADER.txt");
        const   fileContent = await fs.readFile(__dirname + request.url);
        const footerContent = await fs.readFile(__dirname + "/FOOTER.txt");

        response.writeHead(200);
        response.write(headerContent);
        response.write(fileContent);
        response.end(footerContent);
    } catch (error) {
        console.log(error);
        response.writeHead(404);
        response.end(JSON.stringify(error));
    }
}
