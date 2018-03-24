var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:derp', function(req, res, next) {
  res.render('index', { title: req.params.derp });
});

module.exports = router;
