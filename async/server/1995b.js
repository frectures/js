const http = require("http");
const fs   = require("fs");

const server = http.createServer(requestListener);
server.listen(8080);

function requestListener(request, response) {
    console.log(request.url);

    fs.readFile(__dirname + "/HEADER.txt", function (error, headerContent) {
        if (!error) {
            fs.readFile(__dirname + request.url, function (error, fileContent) {
                if (!error) {
                    fs.readFile(__dirname + "/FOOTER.txt", function (error, footerContent) {
                        if (!error) {
                            response.writeHead(200);
                            response.write(headerContent);
                            response.write(fileContent);
                            response.end(footerContent);
                        } else {
                            console.log(error);
                            response.writeHead(404);
                            response.end(JSON.stringify(error));
                        }
                    });
                } else {
                    console.log(error);
                    response.writeHead(404);
                    response.end(JSON.stringify(error));
                }
            });
        } else {
            console.log(error);
            response.writeHead(404);
            response.end(JSON.stringify(error));
        }
    });
}
