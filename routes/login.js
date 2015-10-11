var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
var oauth = require('oauth');
var util = require('util');

var _openbankConsumerKey = 'wpllfrtcatqu3cfsz32y4ydc3u5swz1as1sujogt';
  var _openbankConsumerSecret = 'o3wib4ud05ozeyjxrf5vwu3oz4qnj24ooglsbcfm';
  var base_url = "https://rbs.openbankproject.com";

var consumer = new oauth.OAuth(
    base_url + '/oauth/initiate',
    base_url + '/oauth/token',
    _openbankConsumerKey,
    _openbankConsumerSecret,
    '1.0',                             //rfc oauth 1.0, includes 1.0a
    'http://localhost:3000/callback',
    'HMAC-SHA1');


router.get('/', function(req, res){
    consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
      if (error) {
        res.status(500).send("Error getting OAuth request token : " + util.inspect(error));
      } else {
        req.session.oauthRequestToken = oauthToken;
        req.session.oauthRequestTokenSecret = oauthTokenSecret;
        res.redirect(base_url + "/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
        //res.render("index", { views_available: [1,2,4,6,8] });

      }
    });
  });

module.exports = router;
