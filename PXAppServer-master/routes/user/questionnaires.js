const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

router.get('/', helper.getAllQuestionnaires);

router.get('/:id', helper.getQuestionnaire);

/*
 * Submit answers to specified questionnaire.
 * Request should include an array of { questionID, str } called answers, which are the answers to 
 * the specified questionnaire. 
 * questionIDs that aren't in the specified questionnaire will be ignored.
 * Duplicate questionIDs will also be ignored.
 */
router.post('/:id/answer', helper.getInfoFromToken, 
function(req, res, next) {
    let qid = parseInt(req.params.id, 10),
        answers = req.body.answers,
        sql = `SELECT questionID FROM QuestionnaireQuestion qq ` + 
              `WHERE qq.questionnaireID = ${qid}`,
        errMsg = `Failed to answer questionnaire ${qid}`;

    if (!helper.isValidNumber(qid) || qid < 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid questionnaire ID' });
        return;
    }

    if (!answers) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No answers received' });
        return;
    }

    if (!Array.isArray(answers)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: "Answers must be an array" });
        return;
    }
    else {
        let count = 0;
        for (const a of answers) {
            if (!a.questionID || !a.str) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: 'Answer must contain questionID and str' });
                return;
            }
            count++;
        }

        if (count == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid answers' });
            return;
        }
    }

    // Check that a questionnaire with the specified ID exists.
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid questionnaire ID' });
            return;
        }

        let questionIDs = rows.map(elem => elem.questionID);
        sql = 'INSERT INTO Answer(questionnaireID, questionID, userID, str) VALUES';
        for (const a of answers) {
            // Make sure that the questionIDs are in the specified questionnaire.
            if (questionIDs.includes(a.questionID)) {
                sql += `(${qid}, ${db.escape(a.questionID)}, ${res.locals.userID}, ` + 
                       `${db.escape(a.str)}), `
            }
        }
        // Remove trailing comma and space.
        sql = sql.slice(0, -2);

        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({ success: true, message: `Answered ${answers.length} questions` });
            res.locals.qid = qid;
            next();
        })
    });
},
// Assign tags to the user's answers if they match any rules.
function(req, res, next) {
    let userID = res.locals.userID,
        qid = res.locals.qid,
        sql = `SELECT * FROM Answer WHERE questionnaireID=${qid} AND userID=${userID}`;

    db.query(sql, function(e, rows) {
        if (e) {
            console.error(e);
            return;
        }

        if (rows.length == 0) return;

        let answers = rows;

        sql = 'SELECT * FROM QuestionAnswer WHERE questionID IS NOT NULL';
        db.query(sql, function(e, rows) {
            if (e) {
                console.error(e);
                return;
            }

            if (rows.length == 0) return;

            let qaRules = rows;

            sql = 'SELECT * FROM QuestionAnswerTag WHERE questionAnswerID IS NOT NULL';
            db.query(sql, function(e, rows) {
                if (e) {
                    console.error(e);
                    return;
                }

                for (let rule of qaRules) {
                    rule.tags = rows.filter(r => r.questionAnswerID == rule.id);
                }

                res.locals.answers = answers;
                res.locals.qaRules = qaRules;
                next();
            });
        });
    });
},
function(req, res) {
    let userID = res.locals.userID,
        qid = res.locals.qid,
        answers = res.locals.answers,
        qaRules = res.locals.qaRules;

    // Check if any of the answers match the rules and assign the tags.
    sql = 'INSERT INTO AnswerTag(answerID, tagID) VALUES';
    let answerTags = [], matchedRules = [];
    for (let ans of answers) {
        let rules = qaRules.filter(r => r.questionID == ans.questionID);
        for (let r of rules) {
            // Found a match.
            if (ans.str.toLowerCase() == r.str.toLowerCase()) {
                matchedRules.push(r.id);
                // Assign the tags.
                for (let t of r.tags) {
                    let elem = answerTags.find(e => e.answerID == ans.id);
                    if (elem) elem.tags.add(t.tagID);
                    // Use a Set so that the tag is only added once.
                    else answerTags.push({ answerID: ans.id, tags: new Set([t.tagID]) });
                }
            }
        }
    }

    if (answerTags.length == 0) return;

    for (const at of answerTags) {
        for (const t of at.tags) {
            sql += `(${at.answerID}, ${t}), `
        }
    }
    sql = sql.slice(0, -2);

    // "Delete" the existing tags for the user's answers.
    let deleteSQL = `UPDATE AnswerTag SET answerID=NULL WHERE answerID IN ` +
                    `(SELECT id FROM Answer WHERE questionnaireID=${qid} AND userID=${userID})`;
    db.query(deleteSQL, function(e, rows) {
        if (e) {
            console.error(e);
            return;
        }

        db.query(sql, function(e, rows) {
            if (e) console.error(e);
        });
    });
});

module.exports = router;