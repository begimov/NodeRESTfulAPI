var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function(req, res) {

    var parsedUrl = url.parse(req.url, true);

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '')

    var method = req.method.toUpperCase();

    var queryStringObject = parsedUrl.query;

    var headers = req.headers;

    var decoder = new StringDecoder('utf8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        res.end('Added string\n');

        console.log(`METHOD: ${method} 
            | PATH: ${trimmedPath} 
            | QUERY PARAMS: ${JSON.stringify(queryStringObject)} 
            | HEADERS: ${JSON.stringify(headers)}
            | PAYLOAD: ${buffer}`);
    });
})

server.listen(3000, function() {
    console.log('Server is listening');
})
