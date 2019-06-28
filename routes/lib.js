var express = require('express');
var router = express.Router();
var db = require('../db');
let queryRes;

function constructDocQuery(params) {
  let cat1 = (typeof params.cat1 !== 'undefined') ? "cat1 = '" + params.cat1 + "' " : "";
  let cat2 = (typeof params.cat2 !== 'undefined') ? "AND cat2 = '" + params.cat2 + "' " : "";
  let cat3 = (typeof params.cat3 !== 'undefined') ? "AND cat3 = '" + params.cat3 + "' " : "";
  let cat4 = (typeof params.cat4 !== 'undefined') ? "AND cat4 = '" + params.cat4 + "' " : "";
  let pg = (typeof params.pg !== 'undefined') ? "AND pg = '" + params.pg + "' " : "";

  let q =  cat1 + cat2 + cat3 + cat4 + pg;
  console.log(q);
  return q;
};
function getDoc(query, res, pgNum = 1) {
  let queryStr = "select cat1, cat2, cat3, cat4, pg from wt_docs WHERE + " + query + " LIMIT 1;"
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
    res.render('lib', { 
      title: query , 
      searchResult: queryRes, 
    });
  
  }).catch( () => {
    res.render('lib', { title: 'Search Results for "' + query + '"'});
  })
};

/* GET viewer page. */
router.get('/:cat1?/:cat2?/:cat3?/:cat4', function(req, res, next) {
  // grab document info
  console.log(req.params)

  //send info to document query constructor
  let query = constructDocQuery(req.params)

  //query the db, return document + metadata
  //let doc = getDoc(query, res)
  // render page, send document + metadata
  res.render('lib', { 
    title: 'Watchtower Archive', 
    breadcrumbs: [req.params.cat1, req.params.cat2, req.params.cat3, req.params.cat4] 
  });
  
});

module.exports = router;
