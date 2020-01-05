const bcrypt = require('bcrypt'),
      db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      jwt = require('jsonwebtoken'),
      router = express.Router();

const config = helper.config;

// Sign in.
// Request should include email and password.
// Response includes a JSON Web Token to be used for authentication.
router.post('/signin', helper.getTempPassword, function(req, res) {
    let errMsg = 'Failed to sign in',
        email = req.body.email,
        password = req.body.password,
        token = '';

    if (!email || !password) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No email or password received' });
    	return;
    }

    if (!helper.validateEmail(email)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid email' });
        return; 
    }

    email = db.escape(email);
    let sql = 'SELECT id, email, password FROM User ' + 
              `WHERE email = ${email}`;
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e.sqlMessage);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.UNAUTHORIZED)
               .json({ success: false, message: 'Invalid email or password' });
            return;
        }

        // Compare with password stored in database.
        bcrypt.compare(password, rows[0].password, function(e, match) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e.message);
                return;
            }
            
            if (!res.locals.tempPassword) res.locals.tempPassword = '';

            bcrypt.compare(password, res.locals.tempPassword, function(e, tempMatch) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e.message);
                    return;
                }

                if (!(match || tempMatch)) {
                    res.status(httpStatus.UNAUTHORIZED)
                       .json({ success: false, message: 'Invalid email or password' });
                    return;
                }

                token = jwt.sign({ id: rows[0].id, email: rows[0].email }, config.token.secret, 
                                 { expiresIn: '1d' });
                res.json({ success: true, message: 'Signed in', token: token });
                console.log(req.path, email);
            });
        });
    });
});

// Sign up.
router.post('/signup', helper.addUser);

router.use('/account', helper.validateToken, require('./account'));

router.use('/questionnaires', helper.validateToken, require('./questionnaires'));

router.use('/songs', helper.validateToken, require('./songs'));

router.use('/playlists', helper.validateToken, require('./playlists'));

router.use('/appendix', helper.validateToken, require('./appendix'));

router.use('/rules', helper.validateToken, require('./rules'));

module.exports = router;