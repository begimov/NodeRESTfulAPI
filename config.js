var enviroments = {};

enviroments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'secret'
};

enviroments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'secret'
};

var currentEnv = typeof(process.env.NODE_ENV) == 'string' 
    ? process.env.NODE_ENV.toLowerCase() : '';

var enviromentToExport = typeof(enviroments[currentEnv]) == 'object' ? enviroments[currentEnv] : enviroments.staging;

module.exports = enviromentToExport;