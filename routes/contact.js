var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

/* POST the content from the form and do something with it. */
router.post('/', function(req, res) {
  console.log(req.body.message);
  console.log(req.body.email);
  console.log(req.body);
  
  res.render('contact', { title: 'Contact Us' });
})
module.exports = router;
