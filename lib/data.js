var fs = require('fs');
var path = require('path');

var lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function(dir, filename, data, callback) {

    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx', function(err, fileDescriptor) {

        if (!err && fileDescriptor) {

            var stringData = JSON.stringify(data);

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
        } else {
            callback('Could not create data file');
        }
    });
};

lib.read = function(dir, filename, callback) {

    fs.readFile(lib.baseDir + dir + '/' + filename + '.json', 'utf8', function(err, data) {

        callback(err, data);
    });
};

module.exports = lib;