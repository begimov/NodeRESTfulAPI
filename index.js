var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res) {

    var parsedUrl = url.parse(req.url, true);

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '')

    var method = req.method.toUpperCase();

    var queryStringObject = parsedUrl.query;
    queryStringObject.toString = function () { return JSON.stringify(this); };

    res.end('Added string\n');

    console.log(`METHOD: ${method} | PATH: ${trimmedPath} | QUERY PARAMS: ${queryStringObject}`);
})

server.listen(3000, function() {
    console.log('Server is listening');
})
