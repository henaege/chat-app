var http = require("http");
var fs = require("fs");

var server = http.createServer((req, res)=> {
console.log("Someone connected via http.")
fs.readFile('index.html', 'utf-8', (error, data)=> {
    console.log(error);
    console.log(data);
    if (error) {
        res.writeHead(500, {'content-type':'text/html'});
        res.end('Internal server error');
    } else {
        res.writeHead(200,{'content-type':'text/html'});
        res.end(data);
    }
})
});

server.listen(8080);
console.log("Listening on port 8080...");