const bcrypt = require('bcrypt'),
      db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

const config = helper.config;

router.get('/', function(req, res) {
    let errMsg = 'Failed to get all users',
        sql = 'SELECT u.id, u.email, u.typeID, u.institution, u.firstName, u.lastName ' +
              'FROM User u ORDER BY u.id ASC';
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: errMsg });
            return;
        }

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} users`,
            users: rows.map(elem => {
                return {
                    id: elem.id,
                    email: elem.email,
                    typeID: elem.typeID,
                    institution: elem.institution,
                    firstName: elem.firstName,
                    lastName: elem.lastName
                };
            })
        });
    });
});

router.post('/add', helper.addUser);

router.get('/types', function(req, res) {
    let sql = 'SELECT id, type FROM UserType',
        errMsg = 'Failed to get user types';

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            return;
        }

        res.json({
            success: true,
            types: rows.map(elem => { return { id: elem.id, type: elem.type } })
        });
    })
});

router.get('/:id', function(req, res) {
    let userID = parseInt(req.params.id, 10),
        errMsg = `Failed to get user ${userID}`
        sql = `SELECT * FROM User WHERE id=${userID}`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: errMsg });
            return;
        }

        if (rows.length == 0) {
            res.json({ success: false, message: `No user with ID ${userID}` });
            return;
        }

        res.json({ 
            success: true, 
            message: '',
            user: {
                id: rows[0].id,
                email: rows[0].email,
                typeID: rows[0].typeID,
                institution: rows[0].institution,
                firstName: rows[0].firstName,
                lastName: rows[0].lastName
            } 
        });
    });
});

router.get('/:id/playlists', helper.getUserPlaylists);

router.post('/:id/playlists/add', function(req, res) {
    let errMsg = 'Failed to add playlist',
        userID = parseInt(req.params.id, 10),
        playlistID = parseInt(req.body.playlistID, 10),
        sql = `SELECT * FROM UserPlaylist WHERE userID=${userID} AND playlistID=${playlistID}`;

    if (!helper.isValidNumber(userID, 10)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid userID' });
        return;
    }

    if (!helper.isValidNumber(playlistID) || playlistID <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid playlistID' });
        return;
    }

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length > 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Playlist is already in the user\'s playlist' });
            return;
        }

        sql = `INSERT INTO UserPlaylist(userID, playlistID) VALUES(${userID}, ${playlistID})`;
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({
                success: true,
                message: 'Successfully added playlist'
            });
        });
    });
});

router.post('/:id/playlists/:pid/delete', function(req, res) {
    let errMsg = 'Failed to delete playlist',
        userID = parseInt(req.params.id, 10),
        playlistID = parseInt(req.params.pid, 10),
        sql = `SELECT * FROM UserPlaylist WHERE userID=${userID} AND playlistID=${playlistID}`;

    if (!helper.isValidNumber(userID, 10)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid userID' });
        return;
    }

    if (!helper.isValidNumber(playlistID) || playlistID <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid playlistID' });
        return;
    }
    
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: "Playlist isn't in the user's playlist" });
            return;
        }

        sql = `UPDATE UserPlaylist SET userID=NULL ` +
              `WHERE userID=${userID} AND playlistID=${playlistID}`;
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({
                success: true,
                message: 'Successfully deleted playlist'
            });
        });
    });
});

router.post('/:id/playlists/generate', helper.generatePlaylist());

router.get('/:id/answers', function(req, res) {
    let userID = parseInt(req.params.id, 10),
        sql = 'SELECT id, questionnaireID, questionID, str FROM Answer WHERE userID=?',
        errMsg = 'Failed to get answers';

    if (!helper.isValidNumber(userID) || userID < 1) {
        res.status(httpStatus.BAD_REQUEST)
            .json({ success: false, message: 'Invalid user ID' });
        return;
    }

    db.query(sql, [userID], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let rawAnswers = rows;
        sql = 'SELECT * FROM AnswerTag WHERE answerID IS NOT NULL';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            let allTags = rows; 
            // Group all by questionnaireID and group the answers by questionID.
            let answers = [];
            for (const ans of rawAnswers) {
                let qa = answers.find(e => e.questionnaireID == ans.questionnaireID),
                    tags = allTags.filter(e => e.answerID == ans.id)
                                  .map(e => { return { id: e.id, tagID: e.tagID } });
                if (qa) {
                    // A question can have more than 1 answer.
                    let elem = qa.questionAnswers.find(e => e.questionID == ans.questionID);
                    if (elem) elem.answers.push({ id: ans.id, str: ans.str, tags: tags });
                    else {
                        qa.questionAnswers.push({
                            questionID: ans.questionID,
                            answers: [{ id: ans.id, str: ans.str, tags: tags }]
                        });
                    }
                }
                else {
                    answers.push({
                        questionnaireID: ans.questionnaireID,
                        questionAnswers: [{ 
                            questionID: ans.questionID,
                            answers: [{ id: ans.id, str: ans.str, tags: tags }]
                        }]
                    });
                }
            }
    
            res.json({
                success: true,
                message: `Successfully retrieved ${rawAnswers.length} answers`,
                answers: answers
            });
        });
    });
});

/*
 * Update the tags for the specified answer.
 * Request should include:
 *   tags: AnswerTag[]
 *     answerID is ignored
 * The existing tags will be "deleted" and the tags passed in will be inserted.
 */
router.post('/:id/answers/:answerID/update-tags', function(req, res) {
    let userID = parseInt(req.params.id, 10),
        answerID = parseInt(req.params.answerID, 10),
        tags = req.body.tags,
        sql = `UPDATE AnswerTag SET answerID=NULL WHERE answerID=${answerID}`,
        insertSQL = 'INSERT INTO AnswerTag(answerID, tagID) VALUES',
        errMsg = 'Failed to update tags',
        count = 0;

    if (!helper.isValidNumber(userID) || userID < 1) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid user ID' });
        return;
    }

    if (!helper.isValidNumber(answerID) || answerID < 1) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid answer ID' });
        return;
    }
    
    if (!Array.isArray(tags) || tags.length == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid tags' });
        return;
    }

    for (const t of tags) {
        if (helper.isValidNumber(t.answerID) && helper.isValidNumber(t.tagID)) {
            insertSQL += `(${t.answerID}, ${t.tagID}), `;
            count++;
        }
    }
    insertSQL = insertSQL.slice(0, -2);

    if (count == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid tags' });
        return;
    }

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        db.query(insertSQL, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({
                success: true,
                message: `Successfully updated ${count} tags`
            });
        });
    });
});

router.post('/:id/update', helper.checkEmailInUse, helper.updateAccountInfo);

router.post('/:id/password/update', function(req, res) {
    let userID = parseInt(req.params.id, 10),
        password = req.body.password,
        sql = 'UPDATE User SET password=? WHERE id=?',
        errMsg = 'Failed to update password';

    if (!helper.isValidNumber(userID) || userID < 1) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid user ID' });
        return;
    }

    if (!password) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No password received' });
        return;
    }

    bcrypt.hash(password, config.bcrypt.rounds, function(e, hash) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        db.query(sql, [hash, userID], function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({ success: true, message: 'Successfully updated password' });
        })
    });
});

router.get('/:id/song-ratings', helper.validateUserID, helper.getSongRatings);

router.post('/:id/song-ratings/add', helper.validateUserID, helper.addSongRating);

router.get('/:id/listening-diary', helper.validateUserID, helper.getListeningDiary);

router.post('/:id/listening-diary/add', helper.validateUserID, helper.addListeningDiary);

router.get('/:id/usage-plan', helper.validateUserID, helper.getUsagePlan);

router.post('/:id/usage-plan/add', helper.validateUserID, helper.addUsagePlan);

module.exports = router;