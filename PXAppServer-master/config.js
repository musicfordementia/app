var config = {
    development: {
        server: {
            port: 3000
        },
        database: {
            host: 'localhost',
            username: 'root',
            password: null,
            name: 'PXApp'
        },
        gmail: {
            email: 'pxappks1908@gmail.com',
            password: 'Kxqsns7hSOCrUqe97so4'
        },
        token: {
            secret: 'pxapp'
        },
        bcrypt: {
            rounds: 10
        }
    },
    production: {
        server: {
            port: 3001
        },
        database: {
            host: 'localhost',
            username: 'ks1908',
            password: 'zoxKoqm879Hm031f',
            name: 'ks1908'
        },
        gmail: {
            email: 'pxappks1908@gmail.com',
            password: 'Kxqsns7hSOCrUqe97so4'
        },
        token: {
            secret: 'pxapp'
        },
        bcrypt: {
            rounds: 10
        }
    }
};

module.exports = config;