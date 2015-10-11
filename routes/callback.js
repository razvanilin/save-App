var express = require('express');
var router = express.Router();
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
    consumer.getOAuthAccessToken(
      req.session.oauthRequestToken,
      req.session.oauthRequestTokenSecret,
      req.query.oauth_verifier,
      function(error, oauthAccessToken, oauthAccessTokenSecret, result) {
        if (error) {
          //oauthAccessToken, -Secret and result are now undefined
          res.status(500).send("Error getting OAuth access token : " + util.inspect(error));
        } else {
          //error is now undefined
          req.session.oauthAccessToken = oauthAccessToken;
          req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
          res.redirect('/signed_in');
        }
      }
    );
  });

module.exports = router;
