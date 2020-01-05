const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

router.post('/playlists/run', helper.getInfoFromToken, function(req, res) {
    let errMsg = 'Failed to run rules',
        userID = res.locals.userID,
        sql = `SELECT * FROM AnswerTag WHERE answerID IN ` +
              `(SELECT id FROM Answer ` +
              `WHERE userID=${userID})`;

    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.BAD_REQUEST)
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
                    switch (r.op) {
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

// Run the rules on all the user's completed questionnaires.
router.post('/question-answers/run', helper.getInfoFromToken, helper.runQARules());

module.exports = router;