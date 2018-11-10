var _data = require('./data');
var helpers = require('./helpers');

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

handlers._users.POST = function(data, callback) {
    var firstName = typeof(data.payload.firstName) == 'string' 
        && data.payload.firstName.trim().length > 0 
        ? data.payload.firstName.trim()
        : false;

    var lastName = typeof(data.payload.lastName) == 'string' 
        && data.payload.lastName.trim().length > 0 
        ? data.payload.lastName.trim()
        : false;
    
    var phone = typeof(data.payload.phone) == 'string' 
        && data.payload.phone.trim().length == 10 
        ? data.payload.phone.trim()
        : false;

    var password = typeof(data.payload.password) == 'string' 
        && data.payload.password.trim().length > 5 
        ? data.payload.password.trim()
        : false;

    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' 
        && data.payload.tosAgreement == true ? true : false;
    
    if(firstName && lastName && phone && password && tosAgreement) {
        _data.read('users', phone, function(err,data) {
            if (err) {
                var hashedPassword = helpers.hash(password);

                if (hashedPassword) {
                    var userObj = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    };
    
                    _data.create('users', phone, userObj, function(err) {
                        if(!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'error' : 'Something went wrong'});
                        }
                    });
                } else {
                    callback(500, {'error' : 'Something went wrong'});
                }
            } else {
                callback(422, {'error' : 'User with such credentials already exists'});
            }
        });
    } else {
        callback(422, {'error' : 'All fields are required'});
    }
};
    
handlers._users.GET = function(data, callback) {
    var phone = typeof(data.queryStringObject.phone) == 'string' 
        && data.queryStringObject.phone.trim().length == 10 
        ? data.queryStringObject.phone.trim()
        : false;

    if(phone) {
        _data.read('users', phone, function(err,data) {
            if (!err) {
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404, {'error' : 'User with such credentials doesnt exist'});
            }
        });
    } else {
        callback(422, {'error' : 'All fields are required'});
    }
};
handlers._users.PUT = function(data, callback) {
    //
};
handlers._users.DELETE = function(data, callback) {
    //
};

handlers.notFound = function(data, callback) {
    callback(404, {'hanlder' : 'notFound'});
};

handlers.ping = function(data, callback) {
    callback(200);
};

module.exports = handlers;