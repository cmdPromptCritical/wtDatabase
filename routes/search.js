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
var aqueryTxt = (query, res, pgNum = 1) => {
  console.log('starting query...');
  
  //ensures pgNum is not NaN and is > 0
  if (isNaN(Number(pgNum))) {
    pgNum = 0;
  }
  pgNum = Number(pgNum)
  if (pgNum == 0) {pgNum = 1}

  let offset = (pgNum-1) * 20;

  let queryStr = "SELECT rnk, cat1, cat2, cat3, cat4, pg, ts_headline(bodytxt, q, 'StartSel=<mark>, StopSel=</mark>, MaxFragments=3, MaxWords=20') as excerpt from (select ts_rank_cd(searchtext, q) as rnk, cat1, cat2, cat3, cat4, pg, bodytxt, q from wt_docs, plainto_tsquery('" + query + "') q WHERE searchtext @@ q ORDER BY rnk desc LIMIT 20 OFFSET " + offset + ") as foo;" // don't use this for querying db!!!
  // pg uses $1, $2, etc for parameterized queries. parameters are provided in an array (e.g. db.query(searchstr, ['search', offset]))
  let safeQuery = "SELECT rnk, cat1, cat2, cat3, cat4, pg, ts_headline(bodytxt, q, 'StartSel=<mark>, StopSel=</mark>, MaxFragments=3, MaxWords=20') as excerpt from (select ts_rank_cd(searchtext, q) as rnk, cat1, cat2, cat3, cat4, pg, bodytxt, q from wt_docs, plainto_tsquery($1) q WHERE searchtext @@ q ORDER BY rnk desc LIMIT 20 OFFSET $2) as foo;"
  return new Promise((resolve, reject) => {
    console.log(pgNum)
    db.query(safeQuery, [query, offset], (err, res) => {
      if (err) {
        console.log('no search results, or something went wrong when searching through the db')
        console.log('error: ', err)
        console.log('query: ', queryStr)
        reject()
      } else {
        let queryRes = res.rows
  
        //console.log(queryRes)
        resolve(queryRes)
      }
    });
  });
}
var getResultsCount = (query, res) => {
  console.log('starting getResultsCount...');
  let queryStr = "SELECT count(docid) as searchHits FROM wt_docs, plainto_tsquery('" + query + "') q WHERE searchtext @@ q;" // don't use this for querying db!!!
  let queryStrParameterized = "SELECT count(docid) as searchHits FROM wt_docs, plainto_tsquery($1) q WHERE searchtext @@ q;"
  return new Promise((resolve, reject) => {
    db.query(queryStrParameterized, [query], (err, res) => {
      if (err) {
        console.log('no search results, or something went wrong when searching through the db')
        console.log('error: ', err)
        console.log('query: ', queryStr)
        reject()
      } else {
        let searchHits = parseInt(res.rows[0].searchhits)
        //console.log(queryRes)
        resolve(searchHits)
      }
    });
  });
}
var renderSearchResults = (query, searchHits, queryRes, pgNum, res) => {
  let pgNums = genPgNums(pgNum)
  console.log('pgNums: ', pgNums)
  //console.log('title: ', res)
  console.log('searchResults: ', queryRes)
  res.render('search', { 
    title: 'Search Results for "' + query + '"' ,
    query: query,
    searchResult: queryRes,
    searchHits: searchHits,
    pagination: { pgArr: pgNums.pgArr, page: pgNum, pgPrev: pgNums.pgPrev, pgNext: pgNums.pgNext,  limit:10, totalRows: 5 }
  });
}
var initSearch = function(q, res, pgNum) {
  return Promise.all([aqueryTxt(q, res, pgNum), getResultsCount(q, res)])
   	.then((messages) => {
    //console.log('message0: ', messages[0]); // slow
    //console.log('message1: ', messages[1]); // fast
    let queryRes = messages[0];
    let searchHits = messages[1];
    renderSearchResults(q, searchHits, queryRes, pgNum, res)
  })
    .catch((e) =>{
    console.log('something went sideways while querying db.');
});
}


/* GET search page. */
router.get('/', (req, res, next) => {
  let q = req.query.q
  let pgNum = parseInt(req.query.p, 10)
  console.log(q)
  // begin search process, render when done
  initSearch(q, res, pgNum);

});

// commented out bc I don't think I'm using POST anywerhe
/* POST the content from the form and do something with it. */
//router.post('/', (req, res) => {
//  queryTxt(req.body.searchString, res)
  
//});

module.exports = router;
