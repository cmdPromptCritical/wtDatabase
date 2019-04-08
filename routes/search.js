var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET search page. */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search' });
});

/* POST the content from the form and do something with it. */
router.post('/', function(req, res) {
  let query = "SELECT COUNT('ayyy') from wt_docs WHERE bodytxt LIKE '\%" + req.body.searchString + "\%' LIMIT 100;"

  console.log('query is: ' + query)

  db.query(query, (err, res) => {
    console.log(res)
    if (err) {
      console.log('something went wrong when querying the db')
    }
  })

  // db.index({
  //   index: 'searches',
  //   type: '_doc',
  //   body: {
  //     string: req.body.searchString
  //   }
  // }, function(err, res){
  //   console.log('elk error: ' + err);
  //   console.log('elk res: ' + res);
  // });
  res.render('search', { title: 'Search' });
});

module.exports = router;
