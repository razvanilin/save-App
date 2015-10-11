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
    consumer.get("https://rbs.openbankproject.com/obp/v1.4.0/banks/rbs-rbs-a/accounts/private",
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret,
    function (error, data, response) {
    	console.log(data.views_available);
        var parsedData = JSON.parse(data);
       	
        //var bank = data.accounts[0].id;
        //$("body").text();

        //res.status(200).send(parsedData);
        //swig.renderFile('C:\\Users\\Razvan\\Documents\\devStuff\\Projects\\saveApp2\\public\\view\\index.html', parsedData['views_available']);
        //console.log(data.views_available.length);
        res.render("banks", { parsedData: parsedData });
    });
  });

module.exports = router;