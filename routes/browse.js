var express = require('express');
var router = express.Router();
// grabs all /browse GET requests
// /browse sends the top level of the 
/* GET about page. */
router.get('/:cat1?/:cat2?/:cat3?/:cat4?', function(req, res, next) {
  console.log(req.params);
  if (req.params.cat1) {
    res.render('browseDrilldown', {layout: 'browseDrilldown', title: 'Browsing :D'});
  } else {
    res.render('browse', { title: 'Browse' });
  }
  

});

module.exports = router;
