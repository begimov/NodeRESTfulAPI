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

        var handler = typeof(router[trimmedPath]) !== 'undefined' 
            ? router[trimmedPath] : handlers.notFound;
        
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        handler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            payload = typeof(payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(`METHOD: ${method} 
                | PATH: ${trimmedPath} 
                | QUERY PARAMS: ${JSON.stringify(queryStringObject)} 
                | HEADERS: ${JSON.stringify(headers)}
                | PAYLOAD: ${buffer}
                | RESPONSE: ${statusCode} / ${payloadString}`);
        });
    });
})

server.listen(3000, function() {
    console.log('Server is listening');
})

var handlers = {};

handlers.test = function(data, callback) {
    callback(406, {'hanlder' : 'test'});
};

handlers.notFound = function(data, callback) {
    callback(404, {'hanlder' : 'notFound'});
};

var router = {
    'test' : handlers.test
};
