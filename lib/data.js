var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

var lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function(dir, filename, data, callback) {

    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx', function(err, fileDescriptor) {

        if (!err && fileDescriptor) {

            var stringData = JSON.stringify(data);

            write(fileDescriptor, stringData, function(err) {
                if (!err) {
                    callback(false);
                } else {
                    callback(err);
                }
            });

        } else {
            callback('Could not create data file');
        }
    });
};

lib.read = function(dir, filename, callback) {

    fs.readFile(lib.baseDir + dir + '/' + filename + '.json', 'utf8', function(err, data) {
        if(!err && data) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

lib.update = function(dir, filename, data, callback) {

    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'r+', function(err, fileDescriptor) {

        if (!err && fileDescriptor) {

            var stringData = JSON.stringify(data);

            fs.truncate(fileDescriptor, function(err) {
                if (!err) {

                    write(fileDescriptor, stringData, function(err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback(err);
                        }
                    });

                } else {
                    callback('Could not truncate data file');
                }
            });
        } else {
            callback('Could not open data file');
        }
    });
};

lib.delete = function (dir, filename, callback) {

    fs.unlink(lib.baseDir + dir + '/' + filename + '.json', function(err) {
        
        if (!err) {
            callback(false);
        } else {
            callback('Could not delete data file');
        }
    });
};

module.exports = lib;

var write = function(fileDescriptor, stringData, callback) {

    fs.writeFile(fileDescriptor, stringData, function(err) {
        if (!err) {

            fs.close(fileDescriptor, function(err) {
                if (!err) {
                    callback(false);

                } else {
                    callback('Could not close data file');
                }
            });
        } else {
            callback('Could not write to data file');
        }
    });
};