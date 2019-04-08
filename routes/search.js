var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET search page. */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search' });
});

/* POST the content from the form and do something with it. */
router.post('/', function(req, res) {
  let query = "select cat1, cat2, pg, ts_headline(bodytxt, to_tsquery('" + req.body.searchString + "'), 'MaxFragments=3, MaxWords=45') from wt_docs WHERE searchtext @@ to_tsquery('" + req.body.searchString + "') LIMIT 20;"
  let queryRes = [];
  console.log('query is: ' + query)

  let searchdb = new Promise(function(resolve, reject) {
    db.query(query, (err, res) => {
      //console.log(res)
      if (err) {
        console.log('something went wrong when querying the db')
      }
      if (res.rows[0]) {
        res.rows.forEach(row => {
          console.log(row.ts_headline)
          queryRes.push(row.ts_headline)
        });
      console.log(typeof queryRes)
      console.log(queryRes)
      }
      resolve()
    })
  })
    searchdb.then(() => {
      res.render('search', { title: 'Search' , searchResult: queryRes});

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
});

module.exports = router;
