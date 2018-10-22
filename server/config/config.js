var env = process.env.NODE_ENV || 'development';
console.log("env*******************", env);

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];

    Object.keys(envConfig).forEach((key) => { //Object.keys returns an array of all the keys in object
        process.env[key] = envConfig[key]; // [] on left side used to set a key and on the right side to call the val of that key
    });
}

//env vars for production are set in the production area


