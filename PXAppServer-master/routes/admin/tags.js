const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      router = express.Router();

router.get('/', function(req, res) {
    let errMsg = 'Failed to get tags',
        sql = 'SELECT * FROM Tag';
    
    db.query(sql, function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({ 
            success: true, 
            message: `Successfully retrieved ${rows.length} tags`,
            tags: rows
        });
    });
});

// Pretty much the same as validateQuestionnaireName() but with tags.
function validateTagName(req, res, next) {
    let errMsg = `Failed to validate tag name: '${req.body.name}'`;

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

    db.query('SELECT * FROM Tag WHERE name = ?', [res.locals.name], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            return;
        }

        if (rows.length > 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Name in use' });
            return;
        }

        next();
    });
}

router.post('/:id/update', validateTagName, function(req, res) {
    let tagID = req.params.id,
        name = res.locals.name,
        errMsg = `Failed to update tag ${tagID}`,
        sql = 'UPDATE Tag SET name = ? WHERE id = ?';

    if (!helper.isValidNumber(tagID) || tagID < 1) {
        res.status(httpStatus.BAD_REQUEST)
           .json({ success: false, message: 'Invalid tagID' });
        return;
    }

    tagID = parseInt(tagID, 10);

    db.query(sql, [name, tagID], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        res.json({ success: true, message: `Successfully updated tag ${tagID}` });
    });
});

router.post('/add', validateTagName, function(req, res) {
    let errMsg = 'Failed to add tag',
        name = res.locals.name,
        sql = 'INSERT INTO Tag(name) VALUES (?)';

    // Check if the tag already exists.
    db.query('SELECT * FROM Tag WHERE name = ?', [name], function(e, rows) {
        if (e) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
               .json({ success: false, message: errMsg });
            console.error(e);
            return;
        }

        if (rows.length > 0) {
            res.status(httpStatus.BAD_REQUEST)
               .json({ success: false, message: 'Tag name in use' });
            return;
        }

        db.query(sql, [name], function(e, rows) {
            if (e) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
                   .json({ success: false, message: errMsg });
                console.error(e);
                return;
            }

            res.json({ success: true, message: 'Successfully added tag' });
        });
    });
});

module.exports = router;