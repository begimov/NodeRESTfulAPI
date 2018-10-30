var handlers = {};

handlers.users = function (data, callback) {
    var acceptableMethods = ['POST','GET','PUT','DELETE'];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {}

handlers._users.GET = function(data, callback) {
        callback(200, {status:'GET'});
    };


handlers.notFound = function(data, callback) {
    callback(404, {'hanlder' : 'notFound'});
};

handlers.ping = function(data, callback) {
    callback(200);
};

module.exports = handlers;