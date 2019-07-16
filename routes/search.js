var express = require('express');
var router = express.Router();
var db = require('../db');
let queryRes;

function genPgNums(pgNum, pgLimit = 10){
  var pgArr;
  var pgPrev;
  var pgNext;
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
  // tests to see if pgLimit is exceeded
  if (pgArr[4] > pgLimit) {
    pgArr = [pgLimit - 4, pgLimit - 3, pgLimit - 2, pgLimit - 1, pgLimit]
  };

  // pgNum - 1, unless you're already at one
  if (pgNum > 1) pgPrev = pgNum - 1;
  if (pgNum <= 1) pgPrev = 1;

  // pgNum + 1, unless you're at max
  if (pgNum == pgLimit) pgNext = pgNum;
  if (pgNum != pgLimit) pgNext = pgNum + 1;
  return {
    pgArr: pgArr, 
    pgPrev: pgPrev, 
    pgNext: pgNext
  };
};

function queryTxt(query, res, pgNum = 1) {
  let queryStr = "SELECT rnk, cat1, cat2, cat3, cat4, pg, ts_headline(bodytxt, q, 'StartSel=<mark>, StopSel=</mark>, MaxFragments=3, MaxWords=45') as excerpt from (select ts_rank_cd(searchtext, q) as rnk, cat1, cat2, cat3, cat4, pg, bodytxt, q from wt_docs, plainto_tsquery('" + query + "') q WHERE searchtext @@ q ORDER BY rnk desc LIMIT 20) as foo;"
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
    let pgNums = genPgNums(pgNum)
    console.log(pgNums)
    res.render('search', { 
      title: query , 
      searchResult: queryRes, 
      pagination: { pgArr: pgNums.pgArr, page: pgNum, pgPrev: pgNums.pgPrev, pgNext: pgNums.pgNext,  limit:10, totalRows: 5 }
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
