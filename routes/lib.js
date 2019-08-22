var express = require('express');
var router = express.Router();
var db = require('../db');
let queryRes;

function constructDocQuery(params) {
  var pgNum = params.pg //moves var to this so it can be modified
  // parses params for pg number, throws it in the right spot if found
  Object.keys(params).forEach(function(key) {
    if (typeof params[key] !== 'undefined') {
      if (isNaN(params[key].slice(1))) {
        //do nothing
      } else {
        // be suuuuper sure we've got the right parameter that is, the pgNumber
        if (isNaN(params[key])) {
          // make undefined and moves value to pg param
          pgNum = parseInt(params[key].slice(1));
          params[key] = undefined;
        };
      };
    };
  
  });
  let cat1 = (typeof params.cat1 !== 'undefined') ? "cat1 = '" + params.cat1 + "' " : "";
  let cat2 = (typeof params.cat2 !== 'undefined') ? "AND cat2 = '" + params.cat2 + "' " : "";
  let cat3 = (typeof params.cat3 !== 'undefined') ? "AND cat3 = '" + params.cat3 + "' " : "";
  let cat4 = (typeof params.cat4 !== 'undefined') ? "AND cat4 = '" + params.cat4 + "' " : "";
  params.pg = pgNum // saves value to object before being overwritten w/ string
  pgNum = (typeof pgNum !== 'undefined') ? "AND pg = " + pgNum + " " : "";
  
  let q =  cat1 + cat2 + cat3 + cat4 + pgNum;
  return [q, params];
};
function getDoc(query, reqQuery, res, params = undefined) {
  if (typeof reqQuery.v != 'undefined') {
    console.log('reqQuery: ', reqQuery.v)
    if (reqQuery.v == 'html') {
      var docType = 'bodyhtml2col';
    }
    if (reqQuery.v == 'txt') {
      var docType = 'bodyhtml';
    }
    if (reqQuery.v == 'pdf') {
      var docType = 'bodypdf';
    }
    
  } else {
    var docType = 'bodyhtml';
  }
  let queryStr = "select cat1, cat2, cat3, cat4, pg, " + docType + " from wt_docs WHERE " + query + " LIMIT 1;"
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
      urlSettings: docType
    });
    console.log('ho', queryRes)
  
  }).catch( (err) => {
    res.render('lib', { title: 'Error for "' + query + '"'});
    console.log('yo', queryRes)
    console.log('error: ', err)
    
  })
};

function peekAtNextPage(query, params, docType) {
  //returns true if there is actually a next page
  //used for prev/next page urls
  //very specific to docType
  if (docType == 'wt' || docType == 'awake') {
    var q = "select * from wt_docs WHERE cat1 = '" + params.cat1 + "' AND cat2 = '" + params.cat2 + "' AND pg = " + parseInt(params.pg) + ";"
  }
  
  //does the actual query
  //TODOOOOOOSAL;KDSFJAS;DKLJASDLFK;AJSDFLAS;DFJ: just pasted this, need to work on it!
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
    console.log('woooh', queryRes)
  
  }).catch( (err) => {
    console.log('error: ', err)
    
  })

}

function prevNextUrls(params) {
  //returns url after the top-level domain
  //this section is very specific to each item in catalogue (e.g. awake, wt, etc)
  //good luck
  
  //if doc is wt or awake, use cat1, cat2, and pg
  if (params.cat1 == 'Watchtower' || params.cat1 =='Awake' || params.cat1 == 'Awake!') {
    var prevPage;
    //convert pg num to number
    var pgNum = params.pg

    //gets prev page #
    //if at pgNum = 1, there's no prevPageURL
    if (pgNum == 1) {
      // no prev page exists!
      var prevPageUrl = 777;
      var nextPageUrl = 666;
    } else {
      // prev page exists, -1
      prevPage = pgNum - 1;
      var prevPageUrl = '/lib/' + params.cat1 + '/' + params.cat2 + '/p' + params.pg
      var nextPageUrl = 666;
    }

    //gets next page #
    //queries db to see if next page exists
  }
  return [prevPageUrl, nextPageUrl];
}
/* GET viewer page. */
router.get('/:cat1?/:cat2?/:cat3?/:cat4/:pg?', function(req, res, next) {
  // grab document info
  console.log(req.params)
    

  //send info to document query constructor
  let [q, params] = constructDocQuery(req.params)

  //query the db, return document + metadata
  let doc = getDoc(q, req.query, res)
  
  //generate url for next page and prev page (if prev page exists)
  let [prevURL, nextURL] = prevNextUrls(params)

  // render page, send document + metadata
  //res.render('lib', { 
   // title: 'Watchtower Archive', 
  //  breadcrumbs: [params.cat1, params.cat2, params.cat3, params.cat4, params.pg] 
  //});
  
});

module.exports = router;
