var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('browse', { title: 'Browse' });
});

module.exports = router;
