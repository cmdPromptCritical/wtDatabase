var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET search page. */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search' });
});

/* POST the content from the form and do something with it. */
router.post('/', (req, res) => {
  let query = "select cat1, cat2, cat3, cat4, pg, ts_headline(bodytxt, plainto_tsquery('" + req.body.searchString + "'), 'MaxFragments=3, MaxWords=45') from wt_docs WHERE searchtext @@ plainto_tsquery('" + req.body.searchString + "') LIMIT 20;"
  let queryRes;
  console.log('query is: ' + query)

  let searchdb = new Promise((resolve, reject) => {
    db.query(query, (err, res) => {
      //console.log(res)
      if (err) {
        console.log('no search results, or something went wrong when searching through the db')
        reject()
      } else {
          queryRes = res.rows
  
          console.log(queryRes)
        resolve()
      }
    });
  })
  searchdb.then(() => {
    res.render('search', { title: 'Search Results for "' + req.body.searchString + '"' , searchResult: queryRes});

  }).catch( () => {
    res.render('search', { title: 'Search Results for "' + req.body.searchString + '"'});
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
