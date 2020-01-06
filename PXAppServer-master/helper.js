const bcrypt = require('bcrypt'),
      db = require('./db'),
      httpStatus = require('http-status-codes'),
      jwt = require('jsonwebtoken'),
      moment = require('moment');

const env = process.env.NODE_ENV || 'development',
      config = require('./config')[env];

function isValidNumber(num) {
    if (num == null) return false;

    let n = parseInt(num, 10);
    return !isNaN(n) && isFinite(n);
}

function validateEmail(email) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

// Returns an error message if invalid. Otherwise returns null.
function validateSignup(input) {
    let valid = true,
        msg = 'The following fields are empty: ',
        fields = [],
        typeID = parseInt(input.typeID, 10),
        nameRegex = /[a-zA-Z]+/,
        institutionRegex = /[a-zA-Z ]+/;

    if (!input.email || !input.password || !input.typeID || !input.firstName || !input.lastName) {
        return 'Not all fields received';
    }

    /*Object.keys(input).map(function(key, index) {
        if (input[key]) input[key] = input[key].trim();
    });*/

    if (input.email.length == 0) {
        fields.push('email');
        valid = false;
    }
    if (input.password.length == 0) {
        fields.push('password');
        valid = false;
    }
    if (input.typeID.length == 0) {
        fields.push('type');
        valid = false;
    }
    if (input.firstName.length == 0) {
        fields.push('firstName');
        valid = false;
    }
    if (input.lastName.length == 0) {
        fields.push('lastName');
        valid = false;
    }

    if (!valid) return msg + fields.join(', ');

    valid = true;
    msg = 'The following fields are invalid: ';
    fields = [];
    if (!validateEmail(input.email)) {
        fields.push('email');
        valid = false;
    }
    if (!isValidNumber(typeID) || !(typeID == 0 || typeID == 1)) {
        fields.push('type');
        valid = false;
    }
    if (input.institution && !institutionRegex.test(input.institution)) {
        fields.push('institution');
        valid = false;
    }
    if (!nameRegex.test(input.firstName)) {
        fields.push('first name');
        valid = false;
    }
    if (!nameRegex.test(input.lastName)) {
        fields.push('last name');
        valid = false;
    }

    if (!valid) return msg + fields.join(', ');

    return null;
}

function validateLink(url) {
    let exp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/,
        regex = new RegExp(exp);
    return url.match(regex);
}

/* 
 * Extracts the JSON Web Token stored in the HTTP header.
 * Returns null if extraction failed.
 * Authorization: Bearer <token>
 */
function extractToken(header) {
    if (!header) return null;

    if (header.startsWith('Bearer '))
        return header.slice('Bearer '.length, header.length);

    return null;
}

// Middleware to validate the JSON Web Token stored in the authorization header.
function validateToken(req, res, next) {
    let header = req.headers['authorization'],
        token = '';

    if (!header) {
        res.status(httpStatus.UNAUTHORIZED)
           .json({ success: false, message: 'Invalid authorization token' });
        return;
    }

    token = extractToken(header);
    if (!token) {
        res.status(httpStatus.UNAUTHORIZED)
           .json({ success: false, message: 'Invalid authorization token' });
        return;
    }

    jwt.verify(token, config.token.secret, function(e, decoded) {
        if (e) {
            if (e.name === 'TokenExpiredError') {
                res.status(httpStatus.UNAUTHORIZED)
                   .json({ success: false,  message: 'Session expired' });
            }
            else {
                res.status(httpStatus.UNAUTHORIZED)
                   .json({ success: false, message: 'Invalid authorization token' });
            }

            return;
        }

        next();
    });
}

function validateAdminToken(req, res, next) {
    let header = req.headers['authorization'],
        token = '';

    if (!header) {
        res.status(httpStatus.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid authorization token' });
        return;
    }

    token = extractToken(header);
    if (!token) {
        res.status(httpStatus.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid authorization token' });
        return;
    }

    jwt.verify(token, config.token.secret, function(e, decoded) {
        if (e) {
            if (e.name === 'TokenExpiredError') {
                res.status(httpStatus.UNAUTHORIZED)
                   .json({ success: false,  message: 'Session expired' });
            }
            else {
                res.status(httpStatus.UNAUTHORIZED)
                   .json({ success: false, message: 'Invalid authorization token' });
            }

            return;
        }

        if (!(decoded.isAdmin && decoded.isAdmin == true)) {
            res.status(httpStatus.UNAUTHORIZED)
               .json({ success: false, message: 'Unauthorized' });
            return;
        }

        next();
    });
}

/* 
 * Middleware to extract the user ID and email from the token in the authorization header.
 * Extracted user ID and email are stored in res.locals.userID and res.locals.email respectively.
 */
function getInfoFromToken(req, res, next) {
    let authHeader = req.headers['authorization'],
        token, decoded;

    if (!authHeader) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No authorization header' });
        return;
    }

    token = extractToken(authHeader);
    if (!token) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No token' });
        return;
    }

    decoded = jwt.decode(token);
    if (!decoded || !decoded.email) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid token' });
        return;
    }

    res.locals.email = decoded.email;
    res.locals.userID = decoded.id;
    next();
}

/* 
 * Middleware to get the user's temporary password.
 * Temporary password will be stored in res.locals.tempPassword if found and not expired.
 * Request should contain the email. If not, then res.locals.email will be used. If that's null, the 
 * authorization header will be checked for a JSON Web Token, from which the email will be extracted 
 * from.
 */
function getTempPassword(req, res, next) {
    let email = req.body.email,
        sql = 'SELECT u.email, tempPassword, expires from TemporaryPassword tp, User u ' + 
                'WHERE tp.userID = u.id AND email=?',
        token;

    if (!email) email = res.locals.email;
    if (!email) {
        token = extractToken(req.headers['authorization']);
        if (token) email = jwt.decode(token).email;
    }
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

    db.query(sql, [email], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: 'Internal server error' });
            console.error(e.message);
            return;
        }

        // Compare against temporary password if it's not expired.
        if (rows.length == 1) {
            var now = moment();
            if (now.isBefore(moment(rows[0].expires))) {
                res.locals.tempPassword = rows[0].tempPassword;
            }
        }

        next();
    });
}

function getAllSongs(req, res) {
    let errMsg = 'Failed to get all songs',
        sql = 'SELECT * FROM Song'

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let songs = rows;
        sql = 'SELECT * FROM SongTag';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            for (let s of songs)
                s.tags = rows.filter(elem => elem.songID == s.id);

            res.json({
                success: true,
                message: `Successfully retrieved ${songs.length} songs`,
                songs: songs
            });
        });
    });
}

function getSongModes(req, res) {
    let errMsg = 'Failed to get song modes',
        sql = 'SELECT * FROM SongMode';
    
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} song modes`,
            modes: rows.map(elem => {
                return  {
                    id: elem.id,
                    mode: elem.mode
                }
            })
        });
    });
}

function getSongGenres(req, res) {
    let errMsg = 'Failed to get song genres',
        sql = 'SELECT * FROM SongGenre';
    
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} song genres`,
            genres: rows.map(elem => {
                return  {
                    id: elem.id,
                    genre: elem.genre
                }
            })
        });
    });
}

function getSongLyrics(req, res) {
    let errMsg = 'Failed to get song lyrics',
        sql = 'SELECT * FROM SongLyric';
    
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} song lyrics`,
            lyrics: rows.map(elem => {
                return  {
                    id: elem.id,
                    lyric: elem.lyric
                }
            })
        });
    });
}

function getPlaylistID(req, res, next) {
    if (!isValidNumber(req.params.id)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid playlist ID' });
        return;
    }
    res.locals.playlistID = parseInt(req.params.id, 10);
    next();
}

// TODO: Get the song tags as well.
function getUserPlaylists(req, res) {
    let errMsg = 'Failed to get user playlists',
        sql = '',
        userID;

    if (isValidNumber(req.params.id)) userID = +(req.params.id);
    if (isValidNumber(res.locals.userID)) userID = +(res.locals.userID);

    if (!isValidNumber(userID)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'userID not set' });
        return;
    }

    sql = `SELECT p.id, p.name, p.description FROM Playlist p, UserPlaylist up ` +
          `WHERE up.userID = ${userID} AND p.id = up.playlistID`;
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let playlists = rows;

        sql = 'SELECT * FROM PlaylistSong';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            let playlistSongs = rows;

            sql = 'SELECT s.id, s.name, s.artist, s.link, s.tempo, m.mode, g.genre, s.length, ' +
                  's.year, l.lyric ' +
                  'FROM Song s, SongMode m, SongGenre g, SongLyric l ' +
                  'WHERE s.modeID = m.id AND s.genreID = g.id AND s.lyricID = l.id ' +
                  'ORDER BY s.name ASC';
            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }

                let allSongs = rows;

                // Get the tags for the playlist.
                sql = 'SELECT pt.playlistID, pt.tagID, t.name FROM PlaylistTag pt, Tag t ' +
                      'WHERE pt.tagID = t.id ORDER BY playlistID, tagID';
                db.query(sql, function(e, rows) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ success: false, message: errMsg });
                        console.error(e);
                        return;
                    }

                    // Insert the songs and tags into each playlist.
                    for (let p of playlists) {
                        p.songs = playlistSongs.filter(e => e.playlistID == p.id)
                                               .map(e => allSongs.find(f => f.id == e.songID));
                        p.tags = rows.filter(e => e.playlistID == p.id)
                                     .map(e => { return { id: e.tagID, name: e.name }; });
                    }

                    res.json({
                        success: true,
                        message: `Successfully retrieved ${playlists.length} playlists`,
                        playlists: playlists
                    });
                });
            });
        });
    });
}

function getPlaylistSongs(req, res) {
    let errMsg = 'Failed to get playlist songs',
        playlistID = res.locals.playlistID,
        sql = 'SELECT s.id, s.name, s.artist, s.link, s.tempo, s.modeID, s.genreID, s.length, ' + 
              's.year, s.lyricID ' + 
              'FROM PlaylistSong ps, Song s ' + 
              `WHERE playlistID = ${playlistID} AND ps.songID = s.id`;
        
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let songs = rows;
        sql = 'SELECT * FROM SongTag';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            for (let s of songs)
                s.tags = rows.filter(elem => elem.songID == s.id);

            res.json({
                success: true,
                message: `Successfully retrieved ${songs.length} songs`,
                songs: songs
            });
        });
    });
}

function getChoiceTypes(req, res) {
    let sql = 'SELECT id, type FROM ChoiceType',
        errMsg = 'Failed to get choice types';

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            return;
        }

        res.json({ 
            success: true, 
            choiceTypes: rows.map(elem => { return { id: elem.id, type: elem.type } }) 
        });
    });
}

/* 
 * Validate question when adding a questionnaire.
 * question.id, choice.id and choice.questionID aren't used, so they're ignored.
 */
function validateAddQuestion(question) {
    if (question == null) {
        return { valid: false, message: 'Question is null' };
    }

    if (question.pageNo == null || !isValidNumber(question.pageNo))
        return { valid: false, message: 'Invalid pageNo' };
    else {
        let pageNo = parseInt(question.pageNo, 10);
        if (pageNo <= 0) {
            return { valid: false, message: 'Invalid pageNo' };
        }
    }
    
    if (question.str == null || !question.str.length)
        return { valid: false, message: 'Invalid str' };

    if (question.typeID == null || !isValidNumber(question.typeID))
        return { valid: false, message: 'Invalid typeID' };

    if (question.hasOther == null || !(question.hasOther == 0 || question.hasOther == 1))
        return { valid: false, message: 'Invalid hasOther' };

    if (question.visibleIfChoiceID != null) {
        if (isValidNumber(question.visibleIfChoiceID)) {
            let vis = parseInt(question.visibleIfChoiceID);
            if (vis < 0) {
                return { valid: false, message: 'Invalid visibleIfChoiceID' };
            }
        }
        else return { valid: false, message: 'Invalid visibleIfChoiceID' };
    }

    // Choices are optional.
    if (question.choices != null || Array.isArray(question.choices)) {
        for (const c of question.choices) {
            if (c.str == null || !c.str.length) {
                return { valid: false, message: 'Invalid choice str' };
            }
        }
    }

    return { valid: true, message: 'Question is valid' }
}

function getAllQuestionnaires(req, res) {
    let errMsg = 'Failed to get all questionnaires',
        sql = 'SELECT q.id, q.name as name, qt.name as type ' +
              'FROM Questionnaire q, QuestionnaireType qt ' +
              'WHERE q.typeID = qt.id';

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
}

function getQuestionnaire(req, res) {
    let qid = parseInt(req.params.id, 10),
        errMsg = `Failed to get questionnaire ${qid}`,
        sql = `SELECT q.name as name, qt.name as typeName ` +
              `FROM Questionnaire q, QuestionnaireType qt ` +
              `WHERE q.id = ${qid} AND q.typeID = qt.id`;

    if (!isValidNumber(qid) || qid <= 0) {
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

        let name = rows[0].name, type = rows[0].typeName,
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

                questionRows.forEach(q => {
                    q.choices = choiceRows.filter(elem => elem.questionID == q.id)
                                          .map(elem => ({ id: elem.id, str: elem.str }));
                });

                res.json({ 
                    success: true, 
                    message: 'Successfully retrieved questionnaire', 
                    questionnaire: {
                        name: name, 
                        type: type,
                        questions: questionRows
                    }
                });
            });
        });
    });
}

// Request should include email, password, type, first name and last name. Institution is optional.
function addUser(req, res) {
    let errMsg = 'Failed to sign up',
        input = {
            email: req.body.email, password: req.body.password, typeID: req.body.typeID, 
            institution: req.body.institution, firstName: req.body.firstName, 
            lastName: req.body.lastName
        },
        error = validateSignup(input),
        sql = 'SELECT * FROM User WHERE email=?';

    if (error) {
        res.status(httpStatus.BAD_REQUEST)
            .json({ success: false, message: error });
        return;
    }

    let email = input.email.trim(),
        password = input.password.trim(),
        typeID = parseInt(input.typeID, 10),
        institution = input.institution,
        firstName = input.firstName.trim(),
        lastName = input.lastName.trim();
    
    if (!institution) {
        institution = '';
    }
    institution = institution.trim();

    // Check if there's alredy a user with the email.
    db.query(sql, [email], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length > 0) {
            res.json({ success: false, message: 'Email in use' });
            return;
        }

        bcrypt.hash(password, config.bcrypt.rounds, function(e, hash) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }
    
            // institution is optional
            if (institution.length == 0) institution = null;
    
            sql = 'INSERT INTO User(email, password, typeID, institution, firstName, lastName) ' +
                  'VALUES(?, ?, ?, ?, ?, ?)'
            db.query(sql, [email, hash, typeID, institution, firstName, lastName], function(e, r) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                        .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }
    
                if (r.affectedRows == 1) {
                    res.json({ success: true, message: 'Signed up' });
                    console.log(req.path, email);
                }
                else {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                }
            });
        });
    });
}

function checkEmailInUse(req, res, next) {
    let userID = 0,
        sql = 'SELECT * FROM User WHERE email=? AND id<>?';

    if (isValidNumber(req.params.id)) userID = +(req.params.id);
    if (isValidNumber(res.locals.userID)) userID = +(res.locals.userID);

    if (req.body.email) {
        if (!validateEmail(req.body.email)) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid email' });
            return;
        }

        // Check that the email isn't in use.
        db.query(sql, [req.body.email, userID], function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: 'Failed to check if email is in use' });
                console.error(e);
                return;
            }

            if (rows.length > 0) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: 'Email in use' });
                return;
            }

            next();
        });
    }
    else next();
}

/* 
 * Update account info (excluding password).
 * Request should include the keys that want to be updated. Missing keys won't be updated.
 * res.locals.userID or req.params.id must be set prior to calling this function.
 * If both are set, res.locals.userID will be used.
 * checkEmailInUse middleware must be called before calling this function.
 */
function updateAccountInfo(req, res) {
    let errMsg = 'Failed to update account info',
        sql = 'UPDATE User SET ',
        userID = 0,
        cols = 0;

    if (isValidNumber(req.params.id)) userID = +(req.params.id);
    if (isValidNumber(res.locals.userID)) userID = +(res.locals.userID);
    if (userID == 0 || !isValidNumber(userID)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid userID' });
        return;
    }

    if (req.body.email) {
        if (!validateEmail(req.body.email)) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid email' });
            return;
        }

        sql += `email = ${db.escape(req.body.email)}, `;
        cols++;
    }

    if (req.body.typeID) {
        let typeID = parseInt(req.body.typeID, 10);
        if (!isValidNumber(typeID) || !(typeID == 1 || typeID == 2)) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid type' });
            return;
        }

        sql += `typeID = ${typeID}, `;
        cols++;
    }

    if (req.body.institution) {
        sql += `institution = ${db.escape(req.body.institution)}, `;
        cols++;
    }

    if (req.body.firstName) {
        sql += `firstName = ${db.escape(req.body.firstName)}, `;
        cols++;
    }

    if (req.body.lastName) {
        sql += `lastName = ${db.escape(req.body.lastName)}, `;
        cols++;
    }

    if (cols == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No fields received' });
        return;
    }

    sql = sql.substring(0, sql.length - 2) + ` WHERE id = ${userID}`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({ success: true, message: 'Successfully updated account info' });
        console.log(req.path, userID);
    });
}

/*
 * Checks the route params or locals for a valid userID.
 * If valid, stores the userID in res.locals.userID.
 */
function validateUserID(req, res, next) {
    let userID = 0;

    if (isValidNumber(req.params.id)) userID = +(req.params.id);
    if (isValidNumber(res.locals.userID)) userID = +(res.locals.userID);
    if (userID == 0 || !isValidNumber(userID)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid userID' });
        return;
    }

    res.locals.userID = userID;

    next();
}

/*
 * Check that the questionnaire has been answered by the user.
 * qid should contain the questionnaireID.
 * Saves the answers in res.locals.
 */
function checkQuestionnaireAnswered(qid) {
    return function(req, res, next) {
        let userID = res.locals.userID,
            errMsg = `Failed to check if user ${userID} has answered questionnaire ${qid}`,
            sql = `SELECT name FROM Questionnaire WHERE id = ${qid}`;

        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                return;
            }

            if (rows.length == 0) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: 'Invalid questionnaireID' });
                return;
            }

            let name = rows[0].name;

            sql = `SELECT questionID FROM QuestionnaireQuestion WHERE questionnaireID = ${qid}`
            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    return;
                }
    
                if (rows.length == 0) {
                    res.status(httpStatus)
                       .json({ success: false, message: 'Invalid questionnaireID' });
                    return;
                }
    
                let questions = rows;
    
                sql = `SELECT questionID FROM Answer ` +
                      `WHERE questionnaireID = ${qid} AND userID = ${userID}`;
                db.query(sql, function(e, rows) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ success: false, message: errMsg });
                        return;
                    }
    
                    if (rows.length < questions.length) {
                        res.json({ 
                            success: false, 
                            message: `'${name}' questionnaire not answered by user ${userID}` 
                        });
                        return;
                    }

                    let ans = {
                        qid: qid,
                        name: name,
                        answers: rows.map(e => {
                            return {
                                id: e.id,
                                questionID: e.questionID,
                                str: e.str
                            }
                        })
                    };
                    if (res.locals.answers) res.locals.answers.push(ans);
                    else res.locals.answers = [ans];
    
                    next();
                });
            });
        });
    }
}

// Not used any more.
function generatePlaylist() {
    const QID_CTC = 5,      // Challenges to Care
          QID_VNADS = 3,    // Vulnerability to Negative Affect in Dementia Scale
          QID_MMSE = 6;     // Mini-Mental State Examination

    let end = function(req, res) {
        let errMsg = 'Failed to generate playlist',
            sql = 'INSERT INTO UserPlaylist(userID, playlistID) VALUES ';
    
        let ctc = res.locals.answers.find(e => e.qid == QID_CTC),
            vnads = res.locals.answers.find(e => e.qid == QID_VNADS),
            mmse = res.locals.answers.find(e => e.qid == QID_MMSE),
            mmse_score = mmse.answers[0],
            count = 0,
            playlistIDs = [];

        if (!isValidNumber(mmse_score) || !(mmse_score >= 0 && mmse_score <= 30)) {
            return res.json({
                success: false,
                message: 'MMSE score must be a number and between 0 and 30 inclusive'
            });
        }

        for (const ans of vnads.answers) {
            let ansStr = ans.str.toLowerCase();
            if (ansStr == 'agree' || ansStr == 'strongly agree') count++;
        }

        let highRisk = count > 3 && mmse.answers[0] < 10;

        // Agitation or anxiety; Restlessness, wandering, or falls
        if (ctc.answers[0] > 0 || ctc.answers[4] > 0) playlistIDs.push(highRisk ? 6 : 2);
        // Withdrawal or apathy
        if (ctc.answers[1] > 0) playlistIDs.push(highRisk ? 7 : 3);
        // Reduced verabl or social engagement; Resistance to care
        if (ctc.answers[2] > 0 || ctc.answers[3] > 0) playlistIDs.push(highRisk ? 8 : 4);
        // Problems sleeping
        if (ctc.answers[5] > 0) playlistIDs.push(highRisk ? 5 : 1);

        for (const id of playlistIDs) sql += `(${res.locals.userID}, ${id}), `;
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
                message: `Successfully generated ${playlistIDs.length} playlists` 
            });
        });
    };

    return [
        validateUserID,
        checkQuestionnaireAnswered(QID_CTC),
        checkQuestionnaireAnswered(QID_VNADS),
        checkQuestionnaireAnswered(QID_MMSE),
        end
    ];
}

function getSongRatings(req, res) {
    let errMsg = 'Failed to get all song ratings',
        userID = res.locals.userID,
        sql = `SELECT id, date, songID, rating FROM SongRating WHERE userID = ${userID}`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} song ratings`,
            songRatings: rows
        });
    });
}

function addSongRating(req, res) {
    let errMsg = 'Failed to add song rating',
        userID = res.locals.userID,
        sql = 'INSERT INTO SongRating(userID, date, songID, rating) VALUES(?, ?, ?, ?)',
        songID = parseInt(req.body.songID, 10),
        rating = parseInt(req.body.rating, 10),
        date = moment().format('YYYY-MM-DD');

    if (!helper.isValidNumber(songID) || songID <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid songID' });
        return;
    }

    if (!helper.isValidNumber(rating) || rating <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid rating' });
        return;
    }

    db.query(sql, [userID, date, songID, rating], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({ success: true, message: 'Successfully added song rating' });
    });    
}

function getListeningDiary(req, res) {
    let errMsg = 'Failed to get listening diary entries',
        userID = res.locals.userID,
        sql = 'SELECT id, dateTime, mood, situation, reaction, comments FROM ListeningDiary ' +
              `WHERE userID = ${userID}`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let entries = rows;

        sql = 'SELECT * FROM DiarySong';
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            for (let e of entries) {
                e.songs = rows.filter(r => r.diaryID == e.id)
                              .map(r => r.songID);
            }

            res.json({
                success: true,
                message: `Successfully retrieved ${entries.length} entries`,
                listeningDiary: entries
            });
        });
    });
}

function addListeningDiary(req, res) {
    const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
    let errMsg = 'Failed to add listening diary entry',
        userID = res.locals.userID,
        sql = 'INSERT INTO ListeningDiary(userID, dateTime, mood, situation, reaction, comments) ' +
              'VALUES(?, ?, ?, ?, ?, ?)',
        dateTime = moment(req.body.dateTime, DATE_TIME_FORMAT)
        songs = req.body.songs;

    if (!dateTime || !moment(dateTime).isValid()) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid dateTime' });
        return;
    }

    const keys = ['mood', 'situation', 'reaction', 'comments'];
    for (const k of keys) {
        let value = req.body[k];
        if (!value || (value = value.trim()).length == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: `Invalid ${k}` });
            return;
        }
    }

    if (!Array.isArray(songs) || songs.length == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid songs' });
        return;
    }
    songs = songs.filter(s => helper.isValidNumber(s))
                 // Filter duplicates
                 .filter((v, i, a) => a.indexOf(v) == i);
    if (songs.length == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid songs' });
        return;
    }

    const values = [
        userID,
        dateTime.format(DATE_TIME_FORMAT),
        req.body.mood.trim(),
        req.body.situation.trim(),
        req.body.reaction.trim(),
        req.body.comments.trim(),
    ];

    db.query(sql, values, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let diaryID = rows.insertId;

        sql = 'INSERT INTO DiarySong(diaryID, songID) VALUES';
        for (const s of songs) {
            sql += `(${diaryID}, ${s}), `;
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
                message: `Successfully added listening diary entry with ${rows.affectedRows} songs`
            });
        });
    });
}

function getUsagePlan(req, res) {
    let errMsg = 'Failed to get usage plan',
        userID = res.locals.userID,
        sql = `SELECT id, playlistID, timeOfDay, symptoms, howOften, howLong FROM UsagePlan ` +
              `WHERE userID = ${userID}`;
              
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} entries`,
            usagePlan: rows
        });
    });
}

function addUsagePlan(req, res) {
    let errMsg = 'Failed to add usage plan',
        userID = res.locals.userID,
        sql = 'INSERT INTO UsagePlan(userID, playlistID, timeOfDay, symptoms, howOten, howLong) ' +
              'VALUES(?, ?, ?, ?, ?, ?)',
        playlistID = parseInt(req.body.playlistID, 10),
        timeOfDay = req.body.timeOfDay,
        symptoms = req.body.symptoms,
        howOften = req.body.howOften,
        howLong = req.body.howLong;

    if (!helper.isValidNumber(playlistID) || playlistID <= 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid playlistID' });
        return;
    }

    for (const k of ['timeOfDay', 'symptoms', 'howOften', 'howLong']) {
        let value = req.body[k];
        if (!value || value.trim().length == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: `Invalid ${k}` });
            return;
        }
    }

    timeOfDay = req.body.timeOfDay.trim();
    symptoms = req.body.symptoms.trim();
    howOften = req.body.howOften.trim();
    howLong = req.body.howLong.trim();

    let values = [userID, playlistID, timeOfDay, symptoms, howOften, howLong];
    db.query(sql, values, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({ success: true, message: 'Successfully added usage plan' });
    });
}

/* 
 * Run the rules on the specified questionnaireID answered by the current user.
 * If qid is null, the rules will be run on all questionnaires answered by the current user.
 * userID and qid must be stored in res.locals.
 */
function runQARules() {
    return [
        function(req, res, next) {
            let errMsg = 'Failed to run rules',
                userID = res.locals.userID,
                qid = res.locals.qid,
                sql = `SELECT * FROM Answer WHERE userID=${userID}`;
        
            if (qid != null) {
                if (!isValidNumber(qid) || qid <= 0) {
                    res.status(httpStatus.BAD_REQUEST)
                       .json({ success: false, message: 'Invalid questionnaireID' });
                    return;
                }
                qid = parseInt(qid, 10);
            }

            if (qid) sql += ` AND questionnaireID = ${qid}`;

            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }
        
                if (rows.length == 0) {
                    let msg = 'No questionnaires answered';
                    if (qid) msg = `Questionnaire ${qid} has not been answered`;

                    res.status(httpStatus.BAD_REQUEST)
                       .json({ success: false, message: msg });
                    return;
                }
        
                let answers = rows;
        
                sql = 'SELECT * FROM QuestionAnswer WHERE questionID IS NOT NULL';
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
                            message: 'No question answer rules found'
                        });
                    }
        
                    let qaRules = rows;
        
                    sql = 'SELECT * FROM QuestionAnswerTag WHERE questionAnswerID IS NOT NULL';
                    db.query(sql, function(e, rows) {
                        if (e) {
                            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                               .json({ success: false, message: errMsg });
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
        // See if any rules match the user's answers and update the answer tags.
        function(req, res) {
            let errMsg = 'Failed to run rules',
                userID = res.locals.userID,
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
        
            if (answerTags.length == 0) {
                return res.json({
                    success: false,
                    message: 'No question answer rules could be matched'
                });
            }
        
            for (const at of answerTags) {
                for (const t of at.tags) {
                    sql += `(${at.answerID}, ${t}), `
                }
            }
            sql = sql.slice(0, -2);
        
            // "Delete" the existing tags for the user's answers.
            let deleteSQL = `UPDATE AnswerTag SET answerID=NULL WHERE answerID IN `;
            if (qid) {
                deleteSQL += `(SELECT id FROM Answer WHERE questionnaireID=${qid} AND ` +
                             `userID=${userID})`;
            }
            else {
                deleteSQL += `(SELECT id FROM Answer WHERE userID=${userID})`;
            }

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
                        message: `Successfully added ${answerTags.length} tags to user's answers`,
                        matchedRules: matchedRules
                    });
                });
            });
        }
    ];
}

module.exports = {
    config,
    isValidNumber, validateEmail, validateSignup, validateLink,
    extractToken, validateToken, getInfoFromToken, validateAdminToken,
    getTempPassword, 
    getAllSongs, getSongModes, getSongGenres, getSongLyrics,
    getPlaylistID, getUserPlaylists, getPlaylistSongs,
    getChoiceTypes, validateAddQuestion, getAllQuestionnaires, getQuestionnaire, 
    addUser, updateAccountInfo, checkEmailInUse,
    generatePlaylist, validateUserID,
    getSongRatings, addSongRating, 
    getListeningDiary, addListeningDiary,
    getUsagePlan, addUsagePlan,
    runQARules
}
