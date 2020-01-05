const bcrypt = require('bcrypt'),
      db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      jwt = require('jsonwebtoken'),
      router = express.Router();

const config = helper.config;

// Get account info.
// No extra request data needed.
router.get('/info', helper.getInfoFromToken, function(req, res) {
    let errMsg = 'Failed to get account info',
        email = db.escape(res.locals.email),
        sql = 'SELECT typeID, institution, firstName, lastName FROM User ' + 
              `WHERE email = ${email}`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e.sqlMessage);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            return;
        }

        res.json({ 
            success: true, 
            message: '',
            account: {
                email: email,
                typeID: rows[0].typeID,
                institution: rows[0].institution,
                firstName: rows[0].firstName,
                lastName: rows[0].lastName
            }
        });
        console.log(req.path, email);
    });
});

router.post('/info/update', helper.getInfoFromToken, helper.checkEmailInUse,
            helper.updateAccountInfo);

// Update account password.
// Request should include currentPassword and newPassword.
router.post('/password/update', helper.getInfoFromToken, helper.getTempPassword, 
function(req, res) {
    let errMsg = 'Failed to update password',
        decoded = jwt.decode(helper.extractToken(req.headers['authorization'])),
        email = db.escape(decoded.email),
        currentPassword = req.body.currentPassword,
        newPassword = req.body.newPassword,
        sql = `SELECT password from User WHERE email = ${email}`;

    if (!currentPassword) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Current password was not received' });
        return;
    }

    if (!newPassword) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'New password was not received' });
        return;
    }

    // Get the current hash of the password.
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e.sqlMessage);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            return;
        }

        // Compare against normal password.
        bcrypt.compare(currentPassword, rows[0].password, function(e, match) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e.message);
                return;
            }

            // Ensure tempPassword is initialised.
            if (!res.locals.tempPassword) res.locals.tempPassword = '';

            // Compare against temporary password.
            bcrypt.compare(currentPassword, res.locals.tempPassword, function(e, tempMatch) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e.message);
                    return;
                }

                // currentPassword doesn't match normal password or temporary password.
                if (!(match || tempMatch)) {
                    res.status(httpStatus.UNAUTHORIZED)
                       .json({ success: false, message: "Current password mismatch" });
                    return;
                }

                // At this point, either passwords match, so hash the new password.
                bcrypt.hash(newPassword, config.bcrypt.rounds, function(e, hash) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ success: false, message: errMsg });
                        console.error(e.message);
                        return;
                    }

                    // Update password to newPassword.
                    sql = `UPDATE User SET password = '${hash}' WHERE email = ${email}`;
                    db.query(sql, function(e, rows) {
                        if (e) {
                            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                               .json({ success: false, message: errMsg });
                            console.error(e.sqlMessage);
                            return;
                        }

                        // Delete temporary password.
                        sql = `DELETE FROM TemporaryPassword where email = ${email}`;
                        db.query(sql, function(e, rows) {
                            if (e) {
                                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                                   .json({ success: false, message: errMsg });
                                console.error(e.sqlMessage);
                                return;
                            }

                            res.json({ success: true, message: 'Password updated' });
                            console.log(req.path, email);
                            return;
                        });
                    });
                });
            });
        });
    });
})

// TODO: Fix this.
// Reset account password.
// Request should include the email address of the account that needs resetting.
// An email will be sent with a temporary randomly generated password.
router.post('/password/reset', function(req, res) {
    let errMsg = 'Failed to reset password',
        email = req.body.email, transporter, data, tempPassword, sql;

    if (!email) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No email received' });
        return;
    }

    if (!validateEmail(email)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid email' });
        return;
    }

    // Check that an account with the specified email exists.
    sql = 'SELECT * FROM User WHERE email=?';
    db.query(sql, [email], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return; 
        }

        if (rows.length == 0) {
            res.json({ success: false, message: 'No account was found with the specified email' });
            return;
        }

        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.gmail.email,
                pass: config.gmail.password
            }
        });

        tempPassword = genPassword.generate({
            length: 20,
            numbers: true,
            uppercase: true
        });

        data = {
            from: `PXApp <${config.gmail.email}>`,
            to: email,
            subject: 'Password Reset',
            text: `Your temporary password is:\n${tempPassword}`
        }

        let userID = rows.id;

        transporter.sendMail(data, function(e, info) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return; 
            }
    
            bcrypt.hash(tempPassword, config.bcrypt.rounds, function(e, hash) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return; 
                }
    
                sql = 'INSERT INTO TemporaryPassword(userID, tempPassword, expires) ' + 
                      'VALUES(?, ?, ?) ON DUPLICATE KEY ' + 
                      'UPDATE tempPassword=VALUES(tempPassword), expires=VALUES(expires)';
                let expires = moment().add(1, 'h').format('YYYY-MM-DD HH:mm:ss');
                db.query(sql, [userID, hash, expires], function(e, rows) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ success: false, message: errMsg });
                        console.error(e);
                        return; 
                    }
    
                    res.json({ success: true, message: 'Email sent' });
                    console.log(req.path, email);
                });
            });
        });
    });
});

module.exports = router;