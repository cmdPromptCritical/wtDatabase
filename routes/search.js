var express = require('express');
var router = express.Router();
var db = require('../db');
let queryRes;

function queryTxt(query, res) {
  let queryStr = "select cat1, cat2, cat3, cat4, pg, ts_headline(bodytxt, plainto_tsquery('" + query + "'), 'MaxFragments=3, MaxWords=45') from wt_docs WHERE searchtext @@ plainto_tsquery('" + query + "') LIMIT 20;"
  let searchdb = new Promise((resolve, reject) => {
    db.query(queryStr, (err, res) => {
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
    res.render('search', { title: 'Search Results for "' + query + '"' , searchResult: queryRes});
  
  }).catch( () => {
    res.render('search', { title: 'Search Results for "' + query + '"'});
  })
};

/* GET search page. */
router.get('/', (req, res, next) => {
  console.log(req.query.q)
  let searchdb = queryTxt(req.query.q, res)

});

/* POST the content from the form and do something with it. */
router.post('/', (req, res) => {
  queryTxt(req.body.searchString, res)
  
  
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
