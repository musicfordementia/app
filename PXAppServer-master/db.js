const mysql = require('mysql');

const env = process.env.NODE_ENV || 'development',
      config = require('./config')[env];

const db = mysql.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.name
});

db.connect(function(e) {
    if (e) {
        console.error(`Failed to connect to database: ${e.message}`);
        process.exit(-1);
    }
    console.log('Connected to database');
});

module.exports = db;