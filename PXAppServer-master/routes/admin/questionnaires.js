const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

// Get all questionnaires.
router.get('/', function(req, res) {
    let errMsg = 'Failed to get all questionnaires',
        sql = 'SELECT * FROM Questionnaire';

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let questionnaires = rows;

        // Get all the questions.
        sql = 'SELECT qq.questionnaireID, q.id, q.pageNo, q.str, q.typeID, q.hasOther, ' + 
              'q.visibleIfChoiceID ' +
              'FROM QuestionnaireQuestion qq, Question q ' +
              'WHERE qq.questionID = q.id';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            let allQuestions = rows;

            // Get all the choices.
            sql = 'SELECT * FROM QuestionChoice';
            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }

                for (let q of questionnaires) {
                    q.questions = allQuestions.filter(e => e.questionnaireID == q.id);
                    q.questions.forEach(e => { delete e.questionnaireID; });
                    
                    for (let qn of q.questions) {
                        let choices = rows.filter(e => e.questionID == qn.id);
                        if (choices.length > 0) {
                            choices.forEach(e => { delete e.questionID; })
                            qn.choices = choices;
                        }
                    }
                }

                res.json({ 
                    success: true, 
                    message: `Successfully retrieved ${rows.length} questionnaires`,
                    questionnaires: questionnaires
                });
            });
        });
    });
});

router.get('/types', function(req, res) {
    let errMsg = 'Failed to get questionnaire types',
        sql = 'SELECT * FROM QuestionnaireType';

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} types`,
            types: rows
        });
    });
});

router.get('/:id', function(req, res) {
    let qid = parseInt(req.params.id, 10),
        errMsg = `Failed to get questionnaire ${qid}`,
        sql = `SELECT * FROM Questionnaire WHERE id = ${qid}`;

    if (!helper.isValidNumber(qid) || qid <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid questionnaire ID' });
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
            res.status(httpStatus.NOT_FOUND)
               .json({ success: false, message: 'Invalid questionnaire ID' });
            return;
        }

        let name = rows[0].name, typeID = rows[0].typeID,
            sql = 'SELECT q.id, q.pageNo, q.str, q.typeID, q.hasOther, q.visibleIfChoiceID ' +
                  'FROM Question q, Questionnaire qn, QuestionnaireQuestion qq ' +
                  `WHERE qn.id = ${qid} AND qn.id = qq.questionnaireID AND qq.questionID = q.id ` +
                  'ORDER BY q.id ASC';
        // Get the questions for the questionnaire.
        db.query(sql, function(e, questionRows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            sql = 'SELECT qc.id, qc.questionID, qc.str ' + 
                  'FROM QuestionChoice qc, QuestionnaireQuestion qq ' +
                  `WHERE qq.questionnaireID = ${qid} AND qc.questionID = qq.questionID`;
            // Get the choices for the questions.
            db.query(sql, function(e, choiceRows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }

                res.json({ 
                    success: true, 
                    message: 'Successfully retrieved questionnaire', 
                    questionnaire: {
                        name: name, 
                        typeID: typeID,
                        questions: questionRows.map(elem => ({ 
                            id: elem.id, 
                            pageNo: elem.pageNo,
                            str: elem.str,
                            typeID: elem.typeID,
                            hasOther: elem.hasOther,
                            visibleIfChoiceID: elem.visibleIfChoiceID,
                            choices: choiceRows.filter(elem1 => elem1.questionID == elem.id)
                                               .map(elem1 => ({ id: elem1.id, str: elem1.str }))
                        }))
                    }
                });
            });
        });
    });
});

// Get all the choices for the questions in selected questionnaire.
router.get('/:id/choices', function(req, res) {
    let qid = parseInt(req.params.id, 10),
        sql = 'SELECT qc.id, qc.questionID, qc.str ' + 
              'FROM QuestionChoice qc, QuestionnaireQuestion qq ' +
              `WHERE qq.questionnaireID = ${qid} AND qc.questionID = qq.questionID`,
        errMsg = `Failed to get choices for questionnaire ${qid}`;

    if (!helper.isValidNumber(qid) || qid < 1) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid questionnaire ID' });
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
            message: `Successfully retrieved ${rows.length} choices`,
            choices: rows.map(elem => {
                return {
                    id: elem.id,
                    questionID: elem.questionID,
                    str: elem.str
                }
            })
        });
    });
});

/*
 * Validates req.body.name and checks that the questionnaire name isn't in use.
 * Stores the trimmed name in res.locals.name.
 */
function validateQuestionnaireName(req, res, next) {
    let errMsg = `Failed to validate questionnaire name: '${req.body.name}'`;

    if (!req.body.name) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No name received' });
        return;
    }

    res.locals.name = req.body.name.trim();
    if (!res.locals.name) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid name' });
        return;
    }

    db.query(`SELECT * FROM Questionnaire WHERE name = ?`, [res.locals.name], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.log(e);
            return;
        }

        if (rows.length > 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ 
                    success: false, 
                    message: `Questionnaire name in use: '${res.locals.name}'`
                });
            return;
        }

        next();
    });
}

// Update questionnaire name and type.
router.post('/:id/update', function(req, res) {
    let qid = parseInt(req.params.id, 10),
        name = req.body.name.trim(),
        sql = `UPDATE Questionnaire SET `
        errMsg = `Failed to update questionnaire ${qid}`,
        count = 0;

    if (!helper.isValidNumber(qid) || qid < 1) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid questionnaire ID' });
        return;
    }

    if (name) {
        sql += `name = ${db.escape(name)}, `;
        count++;
    }

    if (req.body.typeID) {
        if (helper.isValidNumber(req.body.typeID)) {
            let typeID = parseInt(req.body.typeID, 10);
            sql += `typeID = ${typeID}, `;
            count++;
        }
        else {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid typeID' });
            return;
        }
    }

    if (count == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No fields received' });
        return;
    }

    sql = sql.slice(0, -2) + ` WHERE id = ${qid}`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({ success: true, message: `Successfully updated questionnaire ${qid}` });
        console.log(req.path);
    });
});

/* 
 * Add a questionnaire. 
 * Request should include:
 *   name     : string
 *   typeID   : number
 *   questions: Question[]
 * The Question object is the same as the one returned when getting a questionnaire, except that the
 * ids are ignored.
 */
router.post('/add', validateQuestionnaireName, 
function(req, res) {
    let name = res.locals.name,
        typeID = parseInt(req.body.typeID, 10),
        questions = req.body.questions,
        sql = `INSERT INTO Questionnaire(name, typeID) VALUES(?, ?)`,
        errMsg = 'Failed to add questionnaire';

    if (!helper.isValidNumber(typeID) || typeID <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid typeID' });
        return;
    }

    if (!questions || !Array.isArray(questions)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid questions' });
        return;
    }

    for (const q of questions) {
        let result = helper.validateAddQuestion(q);
        if (!result.valid) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: result.message });
            return;
        }
    }

    // Insert the questionnaire.
    db.query(sql, [name, typeID], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let qid = rows.insertId;

        // Insert the questions.
        sql = 'INSERT INTO Question(pageNo, str, typeID, hasOther, visibleIfChoiceID) VALUES';
        for (const q of questions) {
            let vis = null;
            if (q.visibleIfChoiceID) vis = q.visibleIfChoiceID;

            sql += `(${db.escape(q.pageNo)}, ${db.escape(q.str)}, ${db.escape(q.typeID)}, `+ 
                   `${db.escape(q.hasOther)}, ` + `${db.escape(vis)}), `;
        }
        sql = sql.slice(0, -2);
        
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            // Get the ids of the inserted questions.
            sql = 'SELECT id FROM Question WHERE id >= LAST_INSERT_ID()';
            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }

                let questionIDs = rows.map(elem => elem.id);

                // Insert the choices.
                sql = 'INSERT INTO QuestionChoice(questionID, str) VALUES';
                for (let i = 0; i < questions.length; i++) {
                    let choices = questions[i].choices;
                    for (let j = 0; j < choices.length; j++) {
                        sql += `(${questionIDs[i]}, ${db.escape(choices[j].str)}), `;
                    }
                }
                sql = sql.slice(0, -2);
                
                db.query(sql, function(e, rows) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ success: false, message: errMsg });
                        console.error(e);
                        return;
                    }

                    // Map the questions to the questionnaire.
                    sql = 'INSERT INTO QuestionnaireQuestion(questionnaireID, questionID) ' +
                          'VALUES';
                    for (const id of questionIDs) {
                        sql += `(${qid}, ${id}), `;
                    }
                    sql = sql.slice(0, -2);
                    
                    db.query(sql, function(e, rows) {
                        if (e) {
                            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                               .json({ success: false, message: errMsg });
                            console.error(e);
                            return;
                        }

                        res.json({ 
                            success: true, 
                            message: `Successfully added questionnaire ${qid}`
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;