var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.status(200).send('Signing in by OAuth worked. Now you can do API calls on private data like this one: <br><a href="/getBanks">Get private banks</a>')
  });

module.exports = router;