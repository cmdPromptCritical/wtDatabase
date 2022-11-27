var express = require('express');
var router = express.Router();
var db = require('../db');

// grabs all /browse GET requests
// /browse sends the top level of the 
/* GET about page. */
var getNavItems = (params, resQuery) => {
  // queries db for nav items. parameters determine what level the nav is currently
  // at, and which where conditions to apply

  // checks which level to pull data
  var titleColumn;
  var nextTitleColumn;
  var whereCondition = "";
  if(params.cat3) {
    titleColumn = 'cat4'
    nextTitleColumn = 'null'
    whereCondition = " WHERE cat1 = '" + params.cat1 + "' AND cat2 = '" + params.cat2 +"'" + " AND cat3 = '" + params.cat3 +"'"

  } else if(params.cat2) {
	titleColumn = 'cat3'
    nextTitleColumn = 'cat4'
    whereCondition = " WHERE cat1 = '" + params.cat1 + "' AND cat2 = '" + params.cat2 +"'"

  } else if(params.cat1) {
    titleColumn = 'cat2'
    nextTitleColumn = 'cat3'
    whereCondition = " WHERE cat1 = '" + params.cat1 + "'"

  } else {
    titleColumn = 'cat1'
    nextTitleColumn = 'cat2'
    // no where conditions needed
  }
  
  // one last check: see if endoftree == T so it can pull pg#'s for titles
  if(resQuery.endoftree == 'T') {
    titleColumn = 'pg'
  }

  // compiles search query then executes
  var queryv2 = `
            SELECT ` + titleColumn + ` as title, max(pg) as pg, count(pg) as numDocs, max(length(` + nextTitleColumn + `)) as endofTree, 
            CASE
              WHEN (count(pg) = 1) THEN true
              ELSE false
            END AS enableURL
            FROM wt_docs` + whereCondition + " GROUP BY " + titleColumn + " ORDER BY title;"

  // aaaand one last addition: see if endoftree == T so it can pull pg#'s for titles
  //console.log('search query: ', queryv2);
  return new Promise((resolve, reject) => {
    db.query(queryv2, (err, res) => {
      if (err) {
        console.log('no nav query results, or something went wrong when searching through the db')
        console.log('error: ', err)
        console.log('query: ', queryv2)
        reject()
      } else {
        // saves search results to variable
        var searchHits = res.rows
        //console.log('breadcrumbs query:')
        //console.log(res.rows)
        try { console.log('checking for errors in breadcrumbs query: ', res.rows[0]) } catch(err) { 
          console.log('something went wrong with the breadcrumbs query res.rows[0]: ')
          console.log(err)
        }
        resolve(searchHits)
      }
    });
  });
}

// currently being added
var initNavSearch = function(params, reqQuery, res) {
  return Promise.all([getNavItems(params, reqQuery)])
   	.then((messages) => {
    var navItems = messages[0];
    navItems = sortNavItems(navItems)
    let paramsforDisplay = {cat1: params.cat1, cat2: params.cat2, cat3: params.cat3, cat4: params.cat4}
    //working: let paramsforDisplay = {cat1: params.cat1, cat2: params.cat2, cat3: params.cat3, cat4: params.cat4}
    //builds list of urls to send
    let paramURLs = {
      cat1: {name: params.cat1, url: '/browse/0/' + params.cat1},
      cat2: {name: params.cat2, url: ''},
      cat3: {name: params.cat3, url: ''},
      cat4: {name: params.cat4, url: ''}
    } 
    renderNavResults(paramsforDisplay, paramURLs, navItems, res)
  })
    .catch((e) =>{
    console.log('something went sideways while querying db.');
});
}

// takes navItems object, sorts them based off of context
// currently doesn't sort
function sortNavItems(navItems) {
  return navItems
}
// currently being added
// params = breadcrumb items
// navItems = list from querying the db of documents at a certain depth
var renderNavResults = (params, paramURLs, navItems, res) => {
  //console.log('sent to webpage, params: ', params)
  //console.log('sent to webpage, navItems: ', navItems)
  res.render('browseDrilldown', {params: params, navItems: navItems, paramURLs: paramURLs, layout: 'browseDrilldown', title: 'Browsing :D'});
}

router.get('/', function(req, res, next) {
    res.render('browse', { title: 'Browse Library' });
});

router.get('/0/:cat1?/:cat2?/:cat3?/:cat4?', function(req, res, next) {
  // if there are any parameters at all:
  // - query the db for a list of entries
  //var navItems = getNavItems(req.params)
  // - render the browseDrilldown menu
  initNavSearch(req.params, req.query, res)
});

module.exports = router;
