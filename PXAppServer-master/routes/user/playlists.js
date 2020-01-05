const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

router.get('/', helper.getInfoFromToken, function(req, res) {
    let errMsg = 'Failed to get playlists',
        userID = res.locals.userID,
        sql = 'SELECT p.id, p.name, p.description FROM UserPlaylist up, Playlist p ' +
              `WHERE up.playlistID = p.id AND up.userID = ${userID}`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        let playlists = rows;
        if (playlists.length == 0) {
            return res.json({ success: false, message: 'No playlists found' });
        }

        // Find which songs belong to which playlist.
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

                let cmpSong = (a, b) => {
                    const aName = a.name.toLowerCase(),
                          bName = b.name.toLowerCase();
                    if (aName < bName) return -1;
                    if (aName > bName) return 1;
                    return 0;
                }
                // Insert the songs into each playlist.
                for (let p of playlists) {
                    p.songs = playlistSongs.filter(e => e.playlistID == p.id)
                                           .map(e => rows.find(f => f.id == e.songID))
                                           .sort(cmpSong);
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

module.exports = router;