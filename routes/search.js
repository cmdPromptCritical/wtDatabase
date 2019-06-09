var express = require('express');
var router = express.Router();
var db = require('../db');
let queryRes;

function queryTxt(query, res, pgNum = 0) {
  let queryStr = "select generate_series(1,10000000) AS n, cat1, cat2, cat3, cat4, pg, ts_headline(bodytxt, plainto_tsquery('" + query + "'), 'MaxFragments=3, MaxWords=45') from wt_docs WHERE searchtext @@ plainto_tsquery('" + query + "') LIMIT 20;"
  let searchdb = new Promise((resolve, reject) => {
    db.query(queryStr, (err, res) => {
      if (err) {
        console.log('no search results, or something went wrong when searching through the db')
        console.log('error: ', err)
        console.log('query: ', queryStr)
        reject()
      } else {
          queryRes = res.rows
  
          //console.log(queryRes)
        resolve()
      }
    });
  })
  searchdb.then(() => {
    res.render('search', { title: 'Search Results for "' + query + '"' , searchResult: queryRes, pgNum: pgNum});
  
  }).catch( () => {
    res.render('search', { title: 'Search Results for "' + query + '"'});
  })
};

/* GET search page. */
router.get('/', (req, res, next) => {
  let queryTxt = req.query.q
  let pgNum = req.query.p

  console.log(queryTxt)
  console.log(pgNum)
  
  let searchdb = queryTxt(queryTxt, res, pgNum)

});

// commented out bc I don't think I'm using POST anywerhe
/* POST the content from the form and do something with it. */
//router.post('/', (req, res) => {
//  queryTxt(req.body.searchString, res)
  
//});

module.exports = router;
