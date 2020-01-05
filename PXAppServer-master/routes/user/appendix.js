const db = require('../../db'),
      express = require('express'),
      helper = require('../../helper'),
      httpStatus = require('http-status-codes'),
      moment = require('moment'),
      router = express.Router();

router.get('/song-ratings', helper.getInfoFromToken, helper.getSongRatings);

router.post('/song-ratings/add', helper.getInfoFromToken, helper.addSongRating);

router.get('/listening-diary', helper.getInfoFromToken, helper.getListeningDiary);

router.post('/listening-diary/add', helper.getInfoFromToken, helper.addListeningDiary);

router.get('/usage-plan', helper.getInfoFromToken, helper.getUsagePlan);

router.post('/usage-plan/add', helper.getInfoFromToken, helper.addUsagePlan);

module.exports = router;