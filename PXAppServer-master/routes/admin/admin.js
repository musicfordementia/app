const bcrypt = require('bcrypt'),
      db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      jwt = require('jsonwebtoken'),
      router = express.Router();

const config = helper.config;

router.post('/signin', function(req, res) {
    let errMsg = 'Failed to sign in',
        sql = 'SELECT id, password from AdminUser WHERE username = ?';

    if (!req.body.username || !req.body.password) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No username or password received' });
        return;
    }

    db.query(sql, [req.body.username], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e.message);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.UNAUTHORIZED)
               .json({ success: false, message: 'Invalid username or password' });
            return;
        }

        bcrypt.compare(req.body.password, rows[0].password, function(e , match) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.log(e.message);
                return;
            }

            if (!match) {
                res.status(httpStatus.UNAUTHORIZED)
                   .json({ success: false, message: 'Invalid username or password' });
                return;
            }

            let token = jwt.sign(
                { id: rows[0].id, isAdmin: true }, 
                config.token.secret, 
                { expiresIn: '1d' }
            );
            res.json({ success: true, message: 'Signed in', token: token });
            console.log(req.path, req.body.username);
        })
    });
})

router.use('/users', helper.validateAdminToken, require('./users'));

router.use('/songs', helper.validateAdminToken, require('./songs'));

router.use('/playlists', helper.validateAdminToken, require('./playlists'));

router.use('/questionnaires', helper.validateAdminToken, require('./questionnaires'));

router.use('/questions', helper.validateAdminToken, require('./questions'));

router.use('/tags', helper.validateAdminToken, require('./tags'));

router.use('/rules', helper.validateAdminToken, require('./rules'));

module.exports = router;