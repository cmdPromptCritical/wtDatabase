var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/:redirectUrl', function(req, res, next) {
    console.log('beginning redirect: ' + req.params.redirectUrl)
    let webUrl = "https://" + req.params.redirectUrl;
    res.redirect(301, webUrl);
});

module.exports = router;
