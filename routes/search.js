var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var db = require('../db');

/* GET search page. */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search' });
});

/* POST the content from the form and do something with it. */
router.post('/', function(req, res) {
  res.render('search', { title: 'Search' });
  db.index({
    index: 'searches',
    type: '_doc',
    body: {
      string: req.body.searchString
    }
  }, function(err, res){
    console.log('elk error: ' + err);
    console.log('elk res: ' + res);
  });
});

module.exports = router;
