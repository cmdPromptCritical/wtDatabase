var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');

/* Inits db connection */
var client = new elasticsearch.Client({
   hosts: [ 'https://username:password@host:port']
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
