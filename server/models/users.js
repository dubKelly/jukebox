'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	access_token: String,
	refresh_token: String,
	expires_by: String
});

module.exports = mongoose.model('User', userSchema);
