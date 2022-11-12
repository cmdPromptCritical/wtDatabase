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
  var queryStr = "SELECT DISTINCT " + titleColumn + " FROM wt_docs" + whereCondition + ";"
  var queryv2 = `
            SELECT ` + titleColumn + ` as title, max(pg) as pg, count(pg) as numDocs, max(length(` + nextTitleColumn + `)) as endofTree, 
            CASE
              WHEN (count(pg) = 1) THEN true
              ELSE false
            END AS enableURL
            FROM wt_docs` + whereCondition + " GROUP BY " + titleColumn + " ORDER BY title;"

  // aaaand one last addition: see if endoftree == T so it can pull pg#'s for titles
  console.log('search query: ', queryv2);
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
		console.log('breadcrumbs query:')
		console.log(res.rows)
		try { console.log(res.rows[0].title) } catch(err) { 
			console.log('something went wrong with the breadcrumbs query res.rows[0].title: ')
			console.log(err)
		}

        // repackages variable from a messy object into a pretty list
        //var results = [];
        //searchHits.forEach(resultRow => {
        //  results.push(resultRow.cat1)
        //  results.push(resultRow.cat2)
        //  results.push(resultRow.cat3)
        //  results.push(resultRow.cat4)
        //});

        // removes empty rows caused by always grabbing cat1/cat2/cat3/cat4 rows
        //var filterResults = results.filter((el) => {
        //  return el != null
        //});
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
    renderNavResults(paramsforDisplay, navItems, res)
  })
    .catch((e) =>{
    console.log('something went sideways while querying db.');
});
}

// takes navItems object, sorts them based off of context
function sortNavItems(navItems) {
  return navItems
}
// currently being added
var renderNavResults = (params, navItems, res) => {
  console.log('sent to webpage, params: ', params)
  console.log('sent to webpage, navItems: ', navItems)
  res.render('browseDrilldown', {params: params, navItems: navItems, layout: 'browseDrilldown', title: 'Browsing :D'});
}

router.get('/', function(req, res, next) {
    res.render('browse', { title: 'Browse' });
});

router.get('/0/:cat1?/:cat2?/:cat3?/:cat4?', function(req, res, next) {
  // if there are any parameters at all:
  // - query the db for a list of entries
  //var navItems = getNavItems(req.params)
  // - render the browseDrilldown menu
  console.log('aslfalskfjasjsdlfkj', req.query.endoftree)
  initNavSearch(req.params, req.query, res)
  //  res.render('browseDrilldown', {params: params, navItems: navItems, layout: 'browseDrilldown', title: 'Browsing :D'});
});

module.exports = router;
