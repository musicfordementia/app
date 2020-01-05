const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

// Get all songs.
router.get('/', function(req, res) {
    let errMsg = 'Failed to get all songs',
        sql = 'SELECT s.id, s.name, s.artist, s.link, s.tempo, m.mode, g.genre, s.length, s.year,' +
              'l.lyric ' +
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

        res.json({
            success: true,
            message: `Successfully retrieved ${rows.length} songs`,
            songs: rows
        });
    });
});

router.get('/modes', helper.getSongModes);

router.get('/genres', helper.getSongGenres);

router.get('/lyrics', helper.getSongLyrics);

module.exports = router;