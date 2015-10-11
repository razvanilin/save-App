var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true,
		unique: true
	},
	spendingsAcc: {
		account_id: {
			type: String
		},
		bank_id: {
			type: String
		}
	},
	savingsAcc: {
		account_id: {
			type: String
		},
		bank_id: {
			type: String
		}
	},
	rate: {
		type: String
	},
	oauthToken: {
		type: String
	},
	enabled: {
		type: Boolean,
		default: false
	}
});

module.exports = UserSchema;