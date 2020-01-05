const express = require('express'),
      httpStatus = require('http-status-codes');
      
const env = process.env.NODE_ENV || 'development',
      config = require('./config')[env];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For admin website.
app.use(express.static('admin-site'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

app.use('/api/admin', require('./routes/admin/admin'));

app.use('/api/user', require('./routes/user/user'));

app.all('/api/*', function(req, res) {
    res.status(httpStatus.NOT_FOUND)
       .json({ success: false, message: 'Unknown route' });
});

app.get('/files/app.apk', function(req, res) {
    res.download(`${__dirname}/files/app.apk`);
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/admin-site/index.html');
});

app.listen(config.server.port);