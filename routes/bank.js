var express = require('express');
var router = express.Router();
var oauth = require('oauth');
var util = require('util');
var mongoose = require('mongoose');
var userModel = require('../models/User');

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
    consumer.get("https://rbs.openbankproject.com/obp/v1.4.0/banks/rbs-rbs-c/accounts/private",
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret,
    function (error, data, response) {
    	//console.log(data.views_available);
        var parsedData = JSON.parse(data);
       	
        //var bank = data.accounts[0].id;
        //$("body").text();

        //res.status(200).send(parsedData);
        //swig.renderFile('C:\\Users\\Razvan\\Documents\\devStuff\\Projects\\saveApp2\\public\\view\\index.html', parsedData['views_available']);
        //console.log(data.views_available.length);
        res.render("banks", { parsedData: parsedData });

    });
  });

router.post('/', function(req, res) {
	console.log(req.body);
	var details = req.body;
	var spendingAcc = details.spending.substring(0, details.spending.indexOf("*"));
	var spendingBank = details.spending.substring(details.spending.indexOf("*")+1);

	var savingsAcc = details.saving.substring(0, details.saving.indexOf("*"));
	var savingsBank = details.saving.substring(details.saving.indexOf("*")+1);

	var User = mongoose.model("User", userModel);
	var user;
	User.find({user_id: spendingAcc}, function(err, post) {
		if (!err) {
			console.log(post[0].user_id);
			user = new User({
				spendingAcc: {
					account_id: spendingAcc,
					bank_id: spendingBank
				},
				savingsAccount: {
					account_id: savingsAcc,
					bank_id: savingsBank
				},
				rate: "3",
				oauthToken: "token",
				enabled: true
			});

			user.save();

			var accId = post[0].user_id;

			consumer.get("https://rbs.openbankproject.com/obp/v1.4.0/banks/rbs-rbs-c/accounts/"+accId+"/owner/transactions",
				req.session.oauthAccessToken,
			    req.session.oauthAccessTokenSecret,
			    function (error, data, response) {
			    	//console.log(data.views_available);
			        var parsedData = JSON.parse(data);
			       	
			        //var bank = data.accounts[0].id;
			        //$("body").text();

			        //res.status(200).send(parsedData);
			        //swig.renderFile('C:\\Users\\Razvan\\Documents\\devStuff\\Projects\\saveApp2\\public\\view\\index.html', parsedData['views_available']);
			        //console.log(data.views_available.length);
			        /*for (var i=0; i<parsedData.transactions.length;i++) {
			        	console.log("index: "+ i + " ---- "); 
			        	console.log(parsedData.transactions[i].details);
			        }*/
			        var amount = parseInt(parsedData.transactions[0].details.new_balance.amount) - parseInt(parsedData.transactions[19].details.new_balance.amount);
			        res.render("status", {amount: amount});
			    });

		} else {
			user = new User({
				user_id: spendingAcc,
				spendingAcc: {
					account_id: spendingAcc,
					bank_id: spendingBank
				},
				savingsAccount: {
					account_id: savingsAcc,
					bank_id: savingsBank
				},
				rate: "3",
				oauthToken: "token",
				enabled: true
			});

			user.save();
		}

	});

	//res.send(user);
});

module.exports = router;