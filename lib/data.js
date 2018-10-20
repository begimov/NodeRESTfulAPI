var fs = require('fs');
var path = require('path');

var lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function(dir, filename, data, callback) {
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            //
        } else {
            callback('Could not create data file');
        }
    });
};

module.exports = lib;