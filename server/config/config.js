var env = process.env.NODE_ENV || 'development';
console.log("env*******************", env);


if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todoApp';

} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todoAppTest';
} else {
    process.env.MONGODB_URI = 'mongodb://gimzoletova:bgnhrjk1!@ds235053.mlab.com:35053/to_do_app';
}