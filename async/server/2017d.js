const http = require("http");
const fs   = require("fs");

function readFileAsync(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, function (error, fileContent) {
            if (!error) {
                resolve(fileContent);
            } else {
                reject(error);
            }
        });
    });
}

function promiseAll(promises) {
    return new Promise(function (resolve, reject) {
        const n = promises.length;
        const results = new Array(n);
        let countdown = n;
        for (let i = 0; i < n; ++i) {
            promises[i].then(result => {
                results[i] = result;
                if (--countdown == 0) {
                    resolve(results);
                }
            }, reject);
        }
    });
}

const server = http.createServer(requestListener);
server.listen(8080);

async function requestListener(request, response) {
    console.log(request.url);
    try {
        const promises = [
            readFileAsync(__dirname + "/HEADER.txt"),
            readFileAsync(__dirname + request.url),
            readFileAsync(__dirname + "/FOOTER.txt"),
        ];
        const [headerContent, fileContent, footerContent] = await promiseAll(promises);

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
