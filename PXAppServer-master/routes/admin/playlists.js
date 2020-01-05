const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

// TODO: Get the song tags as well.
router.get('/', function(req, res) {
    let errMsg = 'Failed to get all playlists',
        sql = 'SELECT * FROM Playlist';

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
                sql = 'SELECT * FROM PlaylistTag';
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
                        p.tags = rows.filter(e => e.playlistID == p.id);
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
});

router.get('/:id', helper.getPlaylistID, function(req, res) {
    let errMsg = 'Failed to get playlist',
        playlistID = res.locals.playlistID,
        sql = `SELECT * FROM Playlist WHERE id = ${playlistID}`;
        
    db.query(sql, [playlistID], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length == 0) {
            res.status(httpStatus.NOT_FOUND)
               .json({ success: false, message: 'Invalid playlistID' });
            return;
        }

        let playlist = rows[0];
        sql = `SELECT id, tagID FROM PlaylistTag WHERE playlistID = ${playlistID}`;
        db.query(sql, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            playlist.tags = rows;

            sql = `SELECT * FROM Song WHERE id IN ` +
                  `(SELECT songID AS id FROM PlaylistSong WHERE playlistID = ${playlistID})`;
            db.query(sql, function(e, rows) {
                if (e) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                       .json({ success: false, message: errMsg });
                    console.error(e);
                    return;
                }

                playlist.songs = rows;

                sql = 'SELECT * FROM SongTag';
                db.query(sql, function(e, rows) {
                    if (e) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR)
                           .json({ success: false, message: errMsg });
                        console.error(e);
                        return;
                    }

                    let songTags = rows;

                    sql = 'SELECT * FROM Tag';
                    db.query(sql, function(e, rows) {
                        if (e) {
                            res.status(httpStatus.INTERNAL_SERVER_ERROR)
                               .json({ success: false, message: errMsg });
                            console.error(e);
                            return;
                        }

                        for (let s of playlist.songs) {
                            s.tags = songTags.filter(t => t.songID == s.id)
                                             .map(t => { return { id: t.id, tagID: t.tagID }; });
                        }

                        res.json({
                            success: true,
                            message: `Successfully retrieved playlist ${playlistID}`,
                            playlist: playlist
                        });
                    })
                });

            });
        });
    });
});

/*
 * Update a playlist.
 * Similar to adding a playlist, except the existing songs will be replaced with the new songs.
 * That is, any songs not included in the request will be "deleted" from the playlist.
 * Falsy values won't be updated.
 */
router.post('/:id/update', helper.getPlaylistID, 
// Update name and description.
function(req, res, next) {
    let errMsg = 'Failed to update playlist',
        sql = 'UPDATE Playlist SET ',
        playlistID = res.locals.playlistID,
        cols = 0,
        hasNext = !!req.body.songs || !!req.body.tags;

    if (req.body.name) {
        sql += `name = ${db.escape(req.body.name)}, `;
        cols++;
    }

    if (req.body.description) {
        sql += `description = ${db.escape(req.body.description)}, `;
        cols++;
    }

    if (cols == 0) {
        if (hasNext) return next();

        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No fields received' });
        return;
    }

    sql = sql.slice(0, -2) + ` WHERE id = ${playlistID}`;
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (hasNext) return next();
        res.json({ success: true, message: 'Successfully updated playlist' });
    });
},
// Update songs.
function(req, res, next) {
    let errMsg = 'Failed to update playlist songs',
        playlistID = res.locals.playlistID,
        sql = `UPDATE PlaylistSong SET playlistID=NULL WHERE playlistID=${playlistID}`,
        insertSQL = 'INSERT INTO PlaylistSong(playlistID, songID) VALUES ',
        songs = req.body.songs,
        count = 0,
        hasTags = !!req.body.tags;

    if (!songs && hasTags) return next();

    if (!Array.isArray(songs)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'songs must be an array' });
        return;
    }

    for (const song of songs) {
        if (helper.isValidNumber(song.id)) {
            insertSQL += `(${playlistID}, ${song.id}), `;
            count++;
        }
    }
    insertSQL = insertSQL.slice(0, -2);

    if (songs.length == 0 || count == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No songs to update' });
        return;
    }

    // "Delete" songs from playlist.
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        // Insert songs into playlist.
        db.query(insertSQL, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            if (hasTags) return next();
            res.json({ success: true, message: 'Successfully updated playlist' });
        });
    });
},
// Update tags.
function(req, res) {
    let errMsg = 'Failed to update playlist tags',
        playlistID = res.locals.playlistID,
        sql = `UPDATE PlaylistTag SET playlistID=NULL WHERE playlistID=${playlistID}`,
        insertSQL = 'INSERT INTO PlaylistTag(playlistID, tagID) VALUES ',
        tags = req.body.tags,
        count = 0;

    if (!Array.isArray(tags)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'tags must be an array' });
        return;
    }

    for (const t of tags) {
        if (helper.isValidNumber(t.tagID)) {
            insertSQL += `(${playlistID}, ${t.tagID}), `;
            count++;
        }
    }
    insertSQL = insertSQL.slice(0, -2);

    if (tags.length == 0 || count == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'No tags to update' });
        return;
    }

    // "Delete" tags from playlist.
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        // Insert tags into playlist.
        db.query(insertSQL, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({ success: true, message: 'Successfully updated playlist' });
        });
    });
});

/*
 * Add a playlist.
 * Request should include:
 *   name       : string
 *   description: string
 *   songs      : Song[]
 *     only the id is used
 *   tags       : PlaylistTag[] (optional)
 *     Same as the tags returned when getting a playist but only the tagID is used.
 */
router.post('/add', 
function(req, res, next) {
    let errMsg = 'Failed to add playlist',
        sql = 'INSERT INTO Playlist(name, description) VALUES(?, ?)',
        songsSQL = 'INSERT INTO PlaylistSong(playlistID, songID) VALUES ',
        name = req.body.name,
        description = req.body.description,
        songs = req.body.songs,
        hasTags = req.body.tags != null;

    if (!name) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid name' });
        return;
    }

    if (!description) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid description' });
        return;
    }

    if (!Array.isArray(songs)) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid songs' });
        return;
    }

    db.query(sql, [name, description], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        const playlistID = rows.insertId;
        let count = 0;
        for (const song of songs) {
            if (helper.isValidNumber(song.id)) {
                songsSQL += `(${playlistID}, ${song.id}), `;
                count++;
            }
        }
        songsSQL = songsSQL.slice(0, -2);

        if (count == 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Invalid songs' });
            return;
        }

        db.query(songsSQL, function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            if (hasTags) {
                res.locals.playlistID = playlistID;
                return next();
            }

            res.json({ success: true, message: `Successfully added playlist ${playlistID}` });
        });
    });
},
// Insert the tags
function(req, res) {
    let sql = 'INSERT INTO PlaylistTag(playlistID, tagID) VALUES',
        playlistID = res.locals.playlistID,
        errMsg = `Playlist ${playlistID} inserted but tags weren't`
        tags = req.body.tags;

    if (!Array.isArray(tags)) {
        res.status(httpStatus.BAD_REQUEST)
            .json({ success: false, message: errMsg });
        return;
    }

    let count = 0;
    for (const t of tags) {
        if (helper.isValidNumber(t.tagID)) {
            sql += `(${playlistID}, ${t.tagID}), `;
            count++;
        }
    }
    sql = sql.slice(0, -2);

    if (count == 0) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: errMsg });
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
            message: `Successfully inserted playlist ${playlistID} with ${rows.length} tags`
        });
    });
});

module.exports = router;