const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

router.get('/', function(req, res) {
    let errMsg = 'Failed to get all questions',
        sql = 'SELECT * FROM Question';

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} questions`,
            questions: rows
        });
    });
});

router.get('/choicetypes', helper.getChoiceTypes);

router.get('/:id', function(req, res) {
    let qid = req.params.id,
        sql = 'SELECT q.id, q.pageNo, q.str, q.typeID, q.hasOther, q.visibleIfChoiceID ' + 
              `FROM Question q WHERE q.id = ${qid}`,
        errMsg = `Failed to get question ${qid}`;

    if (!helper.isValidNumber(qid) || qid < 1) {
        res.status(httpStatus.BAD_REQUEST)
            .json({ success: false, message: 'Invalid question ID' });
        return;
    }

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        // Get the choices for this question.
        sql = 'SELECT qc.id, qc.str ' + 
              'FROM QuestionChoice qc ' +
              `WHERE qc.questionID = ${qid}`;
        db.query(sql, function(e, choiceRows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({
                success: true,
                message: `Successfully retrieved question ${qid}`,
                question: rows.map(elem => {
                    return {
                        id: elem.id,
                        pageNo: elem.pageNo,
                        str: elem.str,
                        typeID: elem.typeID,
                        hasOther: elem.hasOther,
                        visibleIfChoiceID: elem.visibleIfChoiceID,
                        choices: choiceRows.map(elem => {
                            return { id: elem.id, questionID: qid, str: elem.str }
                        })
                    }
                })
            });
        });
    });
});

/* 
 * Update question.
 * Choices will be updated by their id if non-zero. Choices with id 0 will be inserted.
 * Choices with questionID not matching the route questionID will be ignored.
 * To "delete" a choice, set the questionID to 0.
 */
router.post('/:id/update', function(req, res) {
    let qid = req.params.id,
        sql = 'UPDATE Question SET ',
        errMsg = `Failed to update question ${qid}`,
        cols = 0,
        choicesSQL = '',
        choices = [];

    if (!helper.isValidNumber(qid) || qid < 1) {
        res.status(httpStatus.BAD_REQUEST)
            .json({ success: false, message: 'Invalid question ID' });
        return;
    }

    if (req.body.pageNo) {
        let pageNo = parseInt(req.body.pageNo, 10);

        if (!helper.isValidNumber(pageNo) || pageNo < 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid pageNo' });
            return;
        }

        sql += `pageNo = ${pageNo}, `;
        cols++;
    }

    if (req.body.str) {
        sql += `str = ${db.escape(req.body.str)}, `;
        cols++;
    }

    if (req.body.typeID) {
        let typeID = parseInt(req.body.typeID, 10);

        if (!helper.isValidNumber(typeID) || typeID <= 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid typeID' });
            return;
        }

        sql += `typeID = ${typeID}, `;
        cols++;
    }

    if (req.body.hasOther != null) {
        let hasOther = parseInt(req.body.hasOther, 10);

        if (!helper.isValidNumber(hasOther)) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid hasOther' });
            return;
        }

        sql += `hasOther = ${hasOther}, `;
        cols++;
    }

    if (req.body.visibleIfChoiceID) {
        let visible = parseInt(req.body.visibleIfChoiceID, 10);

        if (!helper.isValidNumber(visible) || visible <= 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid visibleIfChoiceID' });
            return;
        }

        sql += `visibleIfChoiceID = ${visible}, `;
        cols++;
    }

    if (req.body.choices) {
        choices = req.body.choices;

        if (!Array.isArray(choices)) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Choices must be an array' });
            return;
        }

        choices = choices.filter(e => e.questionID == qid || e.questionID == 0);
        if (choices.length > 0) {
            choicesSQL = 'INSERT INTO QuestionChoice(id, questionID, str) VALUES ';
            for (const c of choices) {
                if (c.id == 0) c.id = 'NULL';
                choicesSQL += `(${c.id}, ${c.questionID}, ${db.escape(c.str)}), `;
            }
            /* 
             * Only update str if the passed in questionID matches the stored questionID.
             * For example,
             * database: (1, 1, 'Very important')
             * passed  : (1, 123, 'test')
             * The id matches but the questionID doesn't so we shouldn't update str.
             * 
             * Set questionID to NULL if the passed in questionID is 0. Otherwise, don't update it.
             */
            choicesSQL = choicesSQL.slice(0, -2) + ' ON DUPLICATE KEY UPDATE ' +
                         'str=IF(VALUES(questionID)=questionID, VALUES(str), str), ' +
                         'questionID=IF(VALUES(questionID)=0, NULL, questionID)';
        }
    }

    if (cols == 0) {
        if (!choicesSQL) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'No fields received' });
            return;
        }

        sql = choicesSQL;
        choicesSQL = '';
    }
    else sql = sql.slice(0, -2) + ` WHERE id = ${qid}`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (choicesSQL) {
            db.query(choicesSQL, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }
                
                res.json({ 
                    success: true, 
                    message: `Successfully updated question ${qid}` 
                });
            });
        }
        else {
            res.json({ 
                success: true, 
                message: `Successfully updated question ${qid}` 
            });
        }
    });
});

module.exports = router;