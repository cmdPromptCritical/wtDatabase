var express = require('express');
var router = express.Router();
var db = require('../db');
let queryRes;

function genPgNumArr(pgNum){
  var pgArr;
  if (Number.isNaN(pgNum)) pgNum = 1;
  switch (pgNum) {
    case 1:
      pgArr = [1, 2, 3, 4, 5]
      break;
    case 2:
      pgArr = [1, 2, 3, 4, 5]
      break;
    default:
      pgArr = [pgNum - 2, pgNum - 1, pgNum, pgNum + 1, pgNum + 2]
      break;
  };
  return pgArr
};

function queryTxt(query, res, pgNum = 1) {
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
    let pgNumArr = genPgNumArr(pgNum)
    let currentPage = pgNum
    console.log(queryRes)
    res.render('search', { 
      title: query , 
      searchResult: queryRes, 
      pgNum: pgNum, 
      pgNumArr: pgNumArr, 
      pagination: { page: 3, limit:10, totalRows: 5 }
    });
  
  }).catch( () => {
    res.render('search', { title: 'Search Results for "' + query + '"'});
  })
};

/* GET search page. */
router.get('/', (req, res, next) => {
  let q = req.query.q
  let pgNum = parseInt(req.query.p, 10)
  console.log(q)
  let searchdb = queryTxt(q, res, pgNum)

});

// commented out bc I don't think I'm using POST anywerhe
/* POST the content from the form and do something with it. */
//router.post('/', (req, res) => {
//  queryTxt(req.body.searchString, res)
  
//});

module.exports = router;
