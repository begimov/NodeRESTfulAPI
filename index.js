var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var _data = require('./lib/data');
//
var config = require('./config');

// TODO delete
_data.read('test', 'test', function(err, data) {
    console.log(JSON.parse(data));
});

// HTTP Server
var httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, function() {
    console.log('Server is listening on port ' + config.httpPort + ' | on ' + config.envName);
});

// HTTPS Server
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, function() {
    console.log('Server is listening on port ' + config.httpsPort + ' | on ' + config.envName);
});

// Server unified logic
var unifiedServer = function(req, res) {

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
};

// Routing
var handlers = {};

handlers.notFound = function(data, callback) {
    callback(404, {'hanlder' : 'notFound'});
};

handlers.ping = function(data, callback) {
    callback(200);
};

var router = {
    'ping' : handlers.ping
};
