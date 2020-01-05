const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

router.get('/', helper.getAllSongs);

router.get('/modes', helper.getSongModes);

router.get('/genres', helper.getSongGenres);

router.get('/lyrics', helper.getSongLyrics);

/*
 * Add a song.
 * Request should include:
 *   name    : string
 *   artist  : string
 *   link    : string (optional)
 *   tempo   : number
 *   modeID  : number
 *   genreID : number
 *   length  : number (in seconds)
 *   year    : number
 *   lyricID : number
 *   tags    : Tag[] (optional)
 *     only the tagID is used; id is ignored
 */
router.post('/add', function(req, res) {
    let errMsg = 'Failed to add song',
        sql = 'INSERT INTO Song(name, artist, link, tempo, modeID, genreID, length, year, lyricID)' + 
              'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    if (!req.body.name) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No name received' });
        return;
    }

    if (!req.body.artist) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No artist received' });
        return;
    }

    if (req.body.link) {
        if (!helper.validateLink(req.body.link)) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid link' });
            return;
        }
    }

    let validate = param => {
        if (!helper.isValidNumber(req.body[param])) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: `${param} must be a number` });
            return false;
        }
        else {
            let num = parseInt(req.body[param], 10);
            if (num <= 0) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: `${param} must be greater than 0` });
                return false;
            }
            return true;
        }
    };
    let params = ['tempo', 'modeID', 'genreID', 'length', 'year', 'lyricID'];
    for (const p of params) {
        if (!validate(p)) return;
    }

    let values = [
        req.body.name, req.body.artist, req.body.link, req.body.tempo, req.body.modeID, 
        req.body.genreID, req.body.length, req.body.year, req.body.lyricID
    ];
    db.query(sql, values, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return; 
        }

        let songID = rows.insertId;

        if (req.body.tags) {
            if (!Array.isArray(req.body.tags)) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: 'tags must be an array' });
                return;
            }

            sql = 'INSERT INTO SongTag(songID, tagID) VALUES ';
            let count = 0;
            for (const t of req.body.tags) {
                if (helper.isValidNumber(t.tagID)) {
                    sql += `(${songID}, ${t.tagID}), `;
                    count++;
                }
            }

            if (count > 0) {
                sql = sql.slice(0, -2);

                db.query(sql, function(e, rows) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ 
                               success: false, 
                               message: `Failed to insert tags for song ${songID}` 
                            });
                        console.error(e);
                        return; 
                    }

                    res.json({ success: true, message: 'Successfully added song' });
                });
                return;
            }
        }

        res.json({ success: true, message: 'Successfully added song' });
    });
});

router.get('/:id', function(req, res) {
    let songID = req.params.id;

    if (!helper.isValidNumber(songID)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'song ID must be a number' });
        return;
    }
    else {
        songID = parseInt(songID, 10);
        if (songID <= 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'song ID must be greater than 0' });
            return;
        }
    }

    let errMsg = `Failed to get song ${songID}`,
        sql = `SELECT * FROM Song WHERE id = ${songID}`;
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return; 
        }
        
        if (rows.length == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'No song found' });
            return;
        }

        let song = rows[0];
        sql = `SELECT * FROM SongTag WHERE songID = ${songID}`;
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return; 
            }

            song['tags'] = rows;
            res.json({
                success: true,
                message: `Successfully retrieved song ${songID}`,
                song: song
            });
        });
    });
});

/* 
 * Update song info (including tags).
 * Set the id of a tag to 0 to add the tag to the song.
 * Set the songID of a tag to 0 to "delete" the tag from the song.
 * Falsy values won't be updated.
 */
router.post('/:id/update', function(req, res) {
    let songID = req.params.id;

    if (!helper.isValidNumber(songID)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'song ID must be a number' });
        return;
    }
    else {
        songID = parseInt(songID, 10);
        if (songID <= 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'song ID must be greater than 0' });
            return;
        }
    }

    let errMsg = `Failed to update song ${songID}`,
        sql = 'UPDATE Song SET ',
        tagsSQL = '',
        cols = 0;

    let buildSql = param => {
        if (req.body[param]) {
            sql += `${param} = ${db.escape(req.body[param])}, `;
            cols++;
        }
    };
    for (const p of ['name', 'artist'])
        buildSql(p);

    if (req.body.link) {
        if (!helper.validateLink(req.body.link)) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid link' });
            return;
        }

        sql += `link = ${db.escape(req.body.link)}, `;
        cols++;
    }

    buildSql = param => {
        if (req.body[param]) {
            if (!helper.isValidNumber(req.body[param])) {
                res.status(httpStatus.BAD_REQUEST)
                   .json({ success: false, message: `${param} must be a number` });
                return false;
            }
            else {
                let num = parseInt(req.body[param], 10);
                if (num <= 0) {
                    res.status(httpStatus.BAD_REQUEST)
                       .json({ success: false, message: `${param} must be greater than 0` });
                    return false;
                }

                sql += `${param} = ${num}, `;
                cols++;
            } 
        }

        return true;
    };
    for (const p of ['tempo', 'modeID', 'genreID', 'length', 'year', 'lyricID']) {
        if (!buildSql(p)) return;
    }

    if (req.body.tags) {
        if (!Array.isArray(req.body.tags)) {
            res.status(httpStatus.BAD_REQUEST)
                .json({ success: false, message: 'tags must be an array' });
            return;
        }

        if (req.body.tags.length > 0) {
            tagsSQL = 'INSERT INTO SongTag VALUES ';
            for (const t of req.body.tags) {
                // Set id to NULL to let the DB set the id.
                if (helper.isValidNumber(t.id))
                    t.id = t.id == 0 ? 'NULL' : db.escape(t.id);
                else {
                    res.status(httpStatus.BAD_REQUEST)
                        .json({ success: false, message: `Invalid ID` });
                    return;
                }
                // Set songID to null to 'delete' the tag.
                if (helper.isValidNumber(t.songID) && (t.songID == songID || t.songID == 0))
                    t.songID = t.songID == 0 ? 'NULL' : db.escape(t.songID);
                else t.songID = songID;

                if (t.id == 'NULL' && t.songID == 'NULL') {
                    res.status(httpStatus.BAD_REQUEST)
                       .json({ 
                           success: false, 
                           message: 'Only one of Tag.id or Tag.songID can be 0' 
                        });
                    return;
                }

                if (!helper.isValidNumber(t.tagID)) {
                    res.status(httpStatus.BAD_REQUEST)
                        .json({ success: false, message: 'Invalid tagID' });
                    return;
                }
    
                tagsSQL += `(${t.id}, ${t.songID}, ${t.tagID}), `;
            }
    
            tagsSQL = tagsSQL.slice(0, -2) + ' ON DUPLICATE KEY UPDATE ' + 
                      'songID=VALUES(songID), tagID=VALUES(tagID)';
        }
    }

    if (cols == 0) {
        // Nothing to update.
        if (!tagsSQL) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'No fields received' });
            return;
        }

        sql = tagsSQL;
        tagsSQL = '';
    }
    else sql = sql.substring(0, sql.length - 2) + ` WHERE id = ${songID}`;

    // Check that the song exists.
    db.query(`SELECT * FROM Song WHERE id = ${songID}`, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid song ID' });
            return;
        }

        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }
            
            if (tagsSQL) {
                // Insert new tags.
                db.query(tagsSQL, function(e, rows) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ success: false, message: errMsg });
                        console.error(e);
                        return;
                    }

                    res.json({ success: true, message: `Successfully updated song ${songID}` });
                });

                return;
            }

            res.json({ success: true, message: `Successfully updated song ${songID}` });
        });
    });
});

module.exports = router;