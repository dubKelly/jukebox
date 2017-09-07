"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Keys = require("./server/models/keys");

/* INIT */
var app = express();
var router = express.Router();

var port = process.env.API_PORT || 8080;

/* DB CONFIG */
var promise = mongoose.connect("mongodb://localhost/spotify", {
	useMongoClient: true
});

/* MIDDLEWARE */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Credentials", "true");
 res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
 res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
 res.setHeader("Cache-Control", "no-cache");
 next();
});

/* ROUTES */
router.get("/", function(req, res) {
	res.json("Welcome!");
});

router.route("/keys").get(function(req, res) {
	Keys.find(function(err, keys) {
		if (err) {
			res.send(err);
		}
		res.json(keys)
	});
}).post(function(req, res) {
	var keys = new Keys();

	keys.client_id = req.body.client_id;
	keys.client_secret = req.body.client_secret;

	keys.save(function(err) {
		if (err) {
			res.send(err);
		}
		res.json("User added");
	});
});

app.use("/api", router);

/* START SERVER */
app.listen(port, function() {
	console.log(`Server running on port ${port}`);
});