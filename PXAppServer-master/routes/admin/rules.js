const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

function validateUser(req, res, next) {
    let userID = parseInt(req.body.userID, 10),
        sql = `SELECT * FROM User WHERE id = ${userID}`;

    if (!helper.isValidNumber(userID) || userID <= 0) {
        res.status(httpStatus.BAD_REQUEST)
            .json({ success: false, message: 'Invalid user ID' });
        return;
    }

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: 'Failed to validate user' });
            console.error(e);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid userID' });
            return;
        }

        next();
    });
}

// Get all playlist rules.
router.get('/playlists', function(req, res) {
    let errMsg = 'Failed to get rules',
        sql = 'SELECT * FROM Rule';

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let allRules = rows;

        sql = 'SELECT * FROM RuleTag';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            for (let rule of allRules) {
                rule.tags = rows.filter(e => e.ruleID == rule.id);
            }

            res.json({
                success: true,
                message: `Successfully retrieved ${allRules.length} rules`,
                rules: allRules
            });
        });
    });
});

router.post('/playlists/add', function(req, res) {
    let errMsg = 'Failed to add rule',
        sql = 'SELECT * FROM Rule WHERE tagID=? AND op=? AND count=?',
        tagsCount = 0,
        tagID = parseInt(req.body.tagID, 10),
        op = req.body.op,
        count = parseInt(req.body.count, 10),
        tags = req.body.tags;

    if (!helper.isValidNumber(tagID) || tagID == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid answer tag' });
        return;
    }

    if (!(op == '==' || op == '>' || op == '<')) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid condition' });
        return;
    }

    if (!helper.isValidNumber(count)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid count' });
        return;
    }

    // > 0 is a valid condition
    if ((op == '==' && count <= 0) || 
        (op == '<' && count <= 0) || 
        (op == '>' && count < 0)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid condition or count' });
        return;
    }

    if (!Array.isArray(tags)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid tags' });
        return;
    }

    for (const t of tags) {
        if (helper.isValidNumber(t.tagID)) tagsCount++;
    }

    if (tagsCount == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid tags' });
        return;
    }

    db.query(sql, [tagID, op, count], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length > 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Rule already exists' });
            return;
        }

        sql = 'INSERT INTO Rule(tagID, op, count) VALUES(?, ?, ?)';
        db.query(sql, [tagID, op, count], function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            let ruleID = rows.insertId;
            sql = 'INSERT INTO RuleTag(ruleID, tagID) VALUES';
            for (const t of tags) {
                if (helper.isValidNumber(t.tagID)) {
                    sql += `(${ruleID}, ${t.tagID}), `;
                }
            }
            sql = sql.slice(0, -2);

            errMsg = 'Failed to add tags for rule';
            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }

                res.json({
                    success: true,
                    message: `Successfully added rule with ${tagsCount} tags`
                });
            });
        });
    });
});

// Run all playlist rules and assign the user some playlists.
router.post('/playlists/run', validateUser, function(req, res) {
    let errMsg = 'Failed to run rules',
        userID = parseInt(req.body.userID, 10),
        sql = `SELECT * FROM AnswerTag WHERE answerID IN ` +
              `(SELECT id FROM Answer ` +
              `WHERE userID=${userID})`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length == 0) {
            res.json({ success: false, message: 'No tags assigned to answers' });
            return;
        }

        let answerTags = rows;

        sql = 'SELECT r.id, r.tagID as targetTagID, r.op, r.count, rt.tagID ' +
              'FROM Rule r, RuleTag rt ' +
              'WHERE r.id = rt.ruleID';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            if (rows.length == 0) {
                return res.json({
                    success: false,
                    message: 'No rules found'
                });
            }

            // Group the tags into a rule and group the rules by ID.
            let rules = [];
            for (const r of rows) {
                let elem = rules.find(e => e.id == r.id);
                if (elem) elem.tags.push(r.tagID);
                else {
                    rules.push({
                        id: r.id,
                        tagID: r.targetTagID,
                        op: r.op,
                        count: r.count,
                        tags: [r.tagID]
                    });
                }
            }

            let ruleCount = [];
            for (const ans of answerTags) {
                let r = rules.find(e => e.tagID == ans.tagID);
                if (r) {
                    let rc = ruleCount.find(e => e.id == r.id);
                    if (rc) rc.count++;
                    else ruleCount.push({ id: r.id, count: 1, shouldRun: false });
                    
                    // Check if the rule should be run.
                    rc = ruleCount.find(e => e.id == r.id);
                    switch (r.op)
                    {
                        case '==': 
                            rc.shouldRun = rc.count == r.count;
                            break;

                        case '>':
                            rc.shouldRun = rc.count > r.count;
                            break;

                        case '<':
                            rc.shouldRun = rc.count < r.count;
                            break;
                    }
                }
            }

            let toRun = ruleCount.filter(e => e.shouldRun)
                                 .sort((a, b) => a.id - b.id);
            if (toRun.length == 0) {
                return res.json({
                    success: true,
                    message: 'No rules could be matched'
                });
            }

            promises = [];
            for (const t of toRun) {
                let tags = rules.find(e => e.id == t.id).tags;
                sql = 'SELECT playlistID FROM PlaylistTag WHERE ';

                for (const tagID of tags) sql += `tagID=${tagID} OR `;
                sql = sql.slice(0, -4);

                promises.push(new Promise((resolve, reject) => {
                    db.query(sql, function(e, rows) {
                        if (e) return reject(e);
                        resolve(rows);
                    });
                }));
            }

            Promise.all(promises).then(function(rows) {
                // Collect all the playlistIDs.
                let allPlaylists = [];
                for (const r of rows) {
                    for (const pid of r.map(e => e.playlistID))
                        allPlaylists.push(pid);
                }

                let playlists = new Set(allPlaylists);
                sql = 'INSERT INTO UserPlaylist(userID, playlistID) VALUES';
                for (const id of playlists) sql += `(${userID}, ${id}), `;
                sql = sql.slice(0, -2);

                // "Delete" existing playlists.
                let deleteSQL = `UPDATE UserPlaylist SET userID=NULL WHERE userID=${userID}`;
                db.query(deleteSQL, function(e, rows) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ success: false, message: errMsg });
                        console.error(e);
                        return;
                    }

                    db.query(sql, function(e, rows) {
                        if (e) {
                            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                               .json({ success: false, message: errMsg });
                            console.error(e);
                            return;
                        }

                        res.json({
                            success: true,
                            message: `${playlists.size} playlists have been added`,
                            matchedRules: toRun.map(r => r.id)
                        });
                    });
                });
            });
        });
    });
});

router.get('/playlists/:id', function(req, res) {
    let errMsg = 'Failed to get rules',
        id = parseInt(req.params.id, 10),
        sql = 'SELECT * FROM Rule WHERE id = ?';

    if (!helper.isValidNumber(id) || id <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid playlist rule ID' });
        return;
    }

    db.query(sql, [id], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.NOT_FOUND)
               .json({ success: false, message: 'Playlist rule not found' });
            return;
        }

        let rule = rows[0];

        sql = 'SELECT id, tagID FROM RuleTag WHERE ruleID = ?';
        db.query(sql, [id], function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            rule.tags = rows;

            res.json({
                success: true,
                message: `Successfully retrieved playlist rule`,
                rule: rule
            });
        });
    });
})

router.post('/playlists/:id/update', 
function(req, res, next) {
    let id = parseInt(req.params.id, 10),
        errMsg = `Failed to update playlist rule ${id}`,
        sql = 'UPDATE Rule SET ',
        tagID,
        op = req.body.op,
        count,
        cols = 0,
        hasTags = req.body.tags != null;

    if (!helper.isValidNumber(id) || id <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid playlist rule ID' });
        return;
    }

    if (req.body.tagID) {
        if (!helper.isValidNumber(req.body.tagID)) {
            res.status(httpStatus.BAD_REQUEST)
                .json({ success: false, message: 'Invalid tagID' });
            return;
        }

        tagID = parseInt(req.body.tagID, 10);
        sql += `tagID=${tagID}, `;
        cols++;
    }

    if (op && req.body.count != null) {
        if (!(op == '==' || op == '>' || op == '<')) {
            res.status(httpStatus.BAD_REQUEST)
                .json({ success: false, message: 'Invalid condition' });
            return;
        }

        if (!helper.isValidNumber(req.body.count)) {
            res.status(httpStatus.BAD_REQUEST)
                .json({ success: false, message: 'Invalid count' });
            return;
        }

        count = parseInt(req.body.count, 10);

        if ((op == '==' && count <= 0) || 
            (op == '<' && count <= 0) || 
            (op == '>' && count < 0)) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid condition or count' });
            return;
        }

        sql += `op = ${db.escape(op)}, count = ${count}, `;
        cols += 2;
    }

    // Both op and count are required if either op or count are sent.
    // If both aren't sent, then we don't need to update them.
    if ((op && req.body.count == null) || (op == null && req.body.count != null)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ 
               success: false, 
               message: 'Both condition and count are required' 
            });
        return;
    }

    if (cols == 0) {
        if (hasTags) return next();

        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No fields received' });
        return;
    }

    sql = sql.slice(0, -2) + ` WHERE id=${id}`;

    // Check that the rule doesn't exist.
    let checkSQL = 'SELECT * FROM Rule WHERE tagID=? AND op=? AND count=? AND id<>?';
    db.query(checkSQL, [tagID, op, count, id], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length > 0) {
            return res.json({
                success: false,
                message: `Rule already exists (ID = ${rows[0].id})`
            });
        }

        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            if (hasTags) return next();
            res.json({
                success: true,
                message: `Successfully updated playlist rule ${id}`
            });
        });
    });
},
// Update the tags.
function(req, res) {
    let id = parseInt(req.params.id, 10),
        errMsg = `Failed to update playlist rule ${id} tags`,
        sql = 'INSERT INTO RuleTag(id, ruleID, tagID) VALUES',
        tags = req.body.tags;

    if (!Array.isArray(tags)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid tags' });
        return;
    }

    let count = 0,
        props = ['id', 'tagID'],
        validate = function(tag, prop) {
            if (!helper.isValidNumber(tag[prop]) || tag[prop] < 0) {
                res.status(httpStatus.BAD_REQUEST)
                    .json({ success: false, message: `Invalid tag property: ${prop}` });
                return false;
            }
            return true;
        };
    // Build the SQL query.
    for (const t of tags) {
        for (const p of props) {
            if (!validate(t, p)) return;
            t[p] = parseInt(t[p], 10);
        }

        if (t.id == 0 && t.ruleID == 0) {
            res.status(httpStatus.BAD_REQUEST)
                .json({ 
                    success: false, 
                    message: 'Only one of id or ruleID can be 0' 
                });
        }
        if (t.id == 0) t.id = 'NULL';

        // Set the ruleID to the ID of the current playlist rule we're editing.
        if (helper.isValidNumber(t.ruleID)) {
            if (t.ruleID == 0) t.ruleID = 'NULL';
            else t.ruleID = id;
        }
        else t.ruleID = id;

        sql += `(${t.id}, ${t.ruleID}, ${t.tagID}), `;
        count++;
    }
    sql = sql.slice(0, -2) + ' ON DUPLICATE KEY UPDATE ' + 
          'ruleID = VALUES(ruleID), ' +
          'tagID = VALUES(tagID)';

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

        res.json({
            success: true,
            message: `Successfully updated playlist rule ${id}`
        });
    })
})

// Get all question answer rules. See px_create.sql for more info.
router.get('/question-answers', function(req, res) {
    let errMsg = 'Failed to get question answer rules',
        sql = 'SELECT * FROM QuestionAnswer WHERE questionID IS NOT NULL';

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let answers = rows;

        sql = 'SELECT * FROM QuestionAnswerTag';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({
                success: true,
                message: `Successfully retrieved ${answers.length} question answer rules`,
                rules: answers.map(ans => {
                    return {
                        id: ans.id,
                        questionID: ans.questionID,
                        str: ans.str,
                        tags: rows.filter(t => t.questionAnswerID == ans.id)
                                  .map(t => { return { id: t.id, tagID: t.tagID } })
                    }
                })
            });
        });
    });
});

/*
 * Add a question answer rule.
 * Request must include:
 *   questionID: number
 *   str       : string
 *   tags      : QuestionAnswerTag[]
 * 
 * The tags are the same as the ones returned when getting all the question answer tag mappings,
 * except that the id is ignored (only tagID is used).
 */
router.post('/question-answers/add', function(req, res) {
    let errMsg = 'Failed to add question answer rule',
        questionID = parseInt(req.body.questionID),
        sql = `SELECT * FROM QuestionAnswer WHERE questionID = ${questionID}`,
        str = req.body.str.trim(),
        tags = req.body.tags;

    if (!helper.isValidNumber(questionID) || questionID <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid question' });
        return;
    }

    if (!str) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid answer' });
        return;
    }

    if (!Array.isArray(tags)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid tags' });
        return;
    }

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length > 0) {
            if (rows.questionID == questionID && rows.str.toLowerCase() == str.toLowerCase()) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: 'Question answer rule already exists' });
                return;
            }
        }

        sql = 'INSERT INTO QuestionAnswer(questionID, str) VALUES(?, ?)';
        db.query(sql, [questionID, str], function(e, rows) {
            if (e) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }
    
            let id = rows.insertId,
                tagCount = 0;
            sql = 'INSERT INTO QuestionAnswerTag(questionAnswerID, tagID) VALUES';
            for (const t of tags) {
                if (helper.isValidNumber(t.tagID) && t.tagID > 0) {
                    sql += `(${id}, ${t.tagID}), `;
                    tagCount++;
                }
            }
            sql = sql.slice(0, -2);
    
            if (tagCount == 0) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: 'Invalid tags but rule was still added' });
                return;
            }
            
            errMsg = 'Failed to add tags for rule';
            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.BAD_REQUEST)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }
    
                res.json({
                    success: true,
                    message: `Successfully added question answer tag rule with ${tagCount} tags`
                });
            });
        });
    });
});

/*
 * Run the question answers on the specified user's answers for the specified questionnaire.
 * If any rules match, the existing answer tags will be "deleted" and new ones inserted.
 * Request should include:
 *   userID: number
 *   questionnaireID: number | null
 * If questionnaireID is null, rules will be run on all questionnaires answered by the user.
 */
router.post('/question-answers/run', validateUser, 
function(req, res, next) {
    let userID = parseInt(req.body.userID, 10),
        qid = req.body.questionnaireID;

    if (!helper.isValidNumber(userID) || userID <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid userID' });
        return;
    }

    if (qid != null) {
        if (!helper.isValidNumber(qid) || qid <= 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid questionnaireID' });
            return;
        }

        qid = parseInt(qid, 10);
    }

    res.locals.userID = userID;
    res.locals.qid = qid;
    next();
},
helper.runQARules());

router.get('/question-answers/:id', function(req, res) {
    let id = req.params.id,
        errMsg = `Failed to get question rule ${id}`,
        sql = 'SELECT * FROM QuestionAnswer WHERE id = ? AND questionID IS NOT NULL';

    if (!helper.isValidNumber(id) || id <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid question answer ID' });
        return;
    }

    id = parseInt(req.params.id, 10);

    db.query(sql, [id], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.NOT_FOUND)
               .json({ success: false, message: 'Invalid question answer ID' });
            return;
        }

        let qa = rows[0];

        sql = `SELECT id, tagID FROM QuestionAnswerTag WHERE questionAnswerID = ${id}`;
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            qa.tags = rows;

            res.json({
                success: true,
                message: `Successfully retrieved question answer rule ${id}`,
                rule: qa
            });
        });
    });
});

router.post('/question-answers/:id/update',
// Update QuestionAnswer.
function(req, res, next) {
    let id = req.params.id,
        errMsg = `Failed to update question answer rule ${id}`,
        sql = 'UPDATE QuestionAnswer SET ',
        checkSQL = 'SELECT * FROM QuestionAnswer WHERE questionID=? AND str=?',
        cols = 0,
        questionID = req.body.questionID,
        str = req.body.str.trim(),
        hasTags = req.body.tags != null;

    if (!helper.isValidNumber(id) || id <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid question answer ID' });
        return;
    }

    id = parseInt(req.params.id, 10);
    res.locals.id = id;

    if (helper.isValidNumber(questionID) && questionID > 0) {
        questionID = parseInt(questionID, 10);

        sql += `questionID = ${questionID}, `;
        cols++;
    }

    if (str) {
        sql += `str = ${db.escape(str)}, `
        cols++;
    }

    if (cols == 0) {
        if (hasTags) return next();

        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No fields received' });
        return;
    }

    sql = sql.slice(0, -2) + ` WHERE id = ${id}`;

    db.query(checkSQL, [questionID, str], function(e, rows) {
        if (e) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length > 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Question answer rule already exists' });
            return;
        }

        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }
    
            if (hasTags) return next();
            res.json({
                success: true,
                message: `Successfully updated question answer rule ${id}`
            });
        });
    });
},
// Insert/update QuestionAnswerTag.
function(req, res) {
    let id = res.locals.id,
        errMsg = `Failed to update tags for question answer ${id}`,
        sql = 'INSERT INTO QuestionAnswerTag(id, questionAnswerID, tagID) VALUES',
        tags = req.body.tags;

    if (!Array.isArray(tags)) {
        res.status(httpStatus.BAD_REQUEST)
            .json({ success: false, message: 'No fields received' });
        return;
    }

    let count = 0,
        props = ['id', 'questionAnswerID', 'tagID'],
        validate = function(tag, prop) {
            if (!helper.isValidNumber(tag[prop]) || tag[prop] < 0) {
                res.status(httpStatus.BAD_REQUEST)
                    .json({ success: false, message: `Invalid tag property: ${prop}` });
                return false;
            }
            return true;
        };
    // Build the tagsSQL query.
    for (const t of tags) {
        for (const p of props) {
            if (!validate(t, p)) return;
            t[p] = parseInt(t[p], 10);
        }

        if (t.id == 0 && t.questionAnswerID == 0) {
            res.status(httpStatus.BAD_REQUEST)
                .json({ 
                    success: false, 
                    message: 'Only one of id or questionAnswerID can be 0' 
                });
        }
        if (t.id == 0) t.id = 'NULL';
        if (t.questionAnswerID == 0) t.questionAnswerID = 'NULL';

        sql += `(${t.id}, ${t.questionAnswerID}, ${t.tagID}), `;
        count++;
    }
    sql = sql.slice(0, -2) + ' ON DUPLICATE KEY UPDATE ' + 
          'questionAnswerID = VALUES(questionAnswerID), ' +
          'tagID = VALUES(tagID)';

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

        res.json({
            success: true,
            message: `Successfully updated question answer rule ${id}`
        });
    });
});

router.post('/question-answers/:id/delete', function(req, res) {
    let id = parseInt(req.params.id, 10),
        errMsg = `Failed to delete question answer rule ${id}`,
        sql = `SELECT * FROM QuestionAnswer WHERE id=${id} AND questionID IS NOT NULL`;

    if (!helper.isValidNumber(id) || id <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid question answer rule ID' });
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
               .json({ success: false, message: 'Invalid question answer rule ID' });
            return;
        }

        sql = `UPDATE QuestionAnswer SET questionID=NULL WHERE id=${id}`;
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            sql = `UPDATE QuestionAnswerTag SET questionAnswerID=NULL WHERE questionAnswerID=${id}`;
            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }

                res.json({
                    success: true,
                    message: `Successfully deleted question answer rule ${id}`
                });
            });
        });
    });
});

module.exports = router;