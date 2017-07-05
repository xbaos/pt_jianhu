var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({xbao:'to be a better man---------------'});
});

module.exports = router;
