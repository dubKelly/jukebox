"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var keysSchema = new Schema({
	client_id: String,
	client_secret: String
});

module.exports = mongoose.model("Keys", keysSchema);
