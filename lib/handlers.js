var handlers = {};

handlers.notFound = function(data, callback) {
    callback(404, {'hanlder' : 'notFound'});
};

handlers.ping = function(data, callback) {
    callback(200);
};

module.exports = handlers;