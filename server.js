'use strict';

var express = require("express");
var queryString = require("query-string");
var request = require("request");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var Keys = require("./server/models/keys");
var User = require("./server/models/users");

var client_id = "";
var client_secret = "";
var redirect_uri = "http://localhost:8080/api/callback";


/* INIT */
var app = express();
var router = express.Router();

var port = process.env.API_PORT || 8080;

/* DB CONFIG */
var promise = mongoose.connect("mongodb://localhost/jukebox", {
	useMongoClient: true
});

Keys.findOne({}, [ "client_id" ], function(err, key) {
	if (err) {
		res.send(err);
	}
	client_id = key.client_id;
});

Keys.findOne({}, [ "client_secret" ], function(err, key) {
	if (err) {
		res.send(err);
	}
	client_secret = key.client_secret;
});

/* MIDDLEWARE */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

	res.setHeader("Cache-Control", "no-cache");
	next();
});

/* ROUTES */

// auth
router.get("/login", function(req, res) {
	var authEndpoint = "https://accounts.spotify.com/authorize/?"
	var authQuery = queryString.stringify({
		client_id: client_id,
		response_type: "code",
		scope: "user-library-read user-modify-playback-state user-read-recently-played",
		redirect_uri: redirect_uri
	});
	res.redirect(authEndpoint + authQuery);
});

router.get("/callback", function(req, res) {
	var code = req.query.code;
	
	var authRequest = {
		url: "https://accounts.spotify.com/api/token",
		form: {
			grant_type: "authorization_code",
			code: code,
			redirect_uri: redirect_uri
		},
		headers: {
			"Authorization": "Basic " + (new Buffer(client_id + ":" + client_secret).toString("base64"))
		}
	};

	request.post(authRequest, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var json = JSON.parse(body);
			
			var token_type = json.token_type;
			var access_token = json.access_token;
			var refresh_token = json.refresh_token;
			var expires_in = json.expires_in;

			res.redirect("http://localhost:3000/profile/" + queryString.stringify({
				token_type: token_type,
				access_token: access_token,
				refresh_token: refresh_token,
				expires_in: expires_in
			}));
		}
	});
});

router.get("/refresh", function(req, res) {
	var refresh_token = req.query.refresh_token;
	
	var authRequest = {
		url: "https://accounts.spotify.com/api/token",
		form: {
			grant_type: "refresh_token",
			refresh_token: refresh_token
		},
		headers: {
			"Authorization": "Basic " + (new Buffer(client_id + ":" + client_secret).toString("base64"))
		}
	}

	request.post(authRequest, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			res.json(body);
		}
	});
});

// users
router.route("/users").get(function(req, res) {

	User.find(function(err, user) {
		if (err) {
			res.send(err);
		}
		res.json(user);
	});
}).post(function(req, res) {
	var query = { username: req.body.username };

	User.findOne(query, function(err, user) {
		if (err) {
			console.log(err)
		}
		if (!user) {
			var newUser = new User();

			newUser.username = req.body.username;
			newUser.access_token = req.body.access_token;
			newUser.refresh_token = req.body.refresh_token;
			newUser.expires_by = req.body.expires_by;

			newUser.save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json("User added");
			});
		}
		else {
			user.set({
				username: req.body.username,
				access_token: req.body.access_token,
				refresh_token: req.body.refresh_token,
				expires_by: req.body.expires_by
			});
			user.save(function(err, updatedUser) {
				if (err) {
					res.send(err);
				}
				res.json(updatedUser);
			});
		}
	});
});

router.route("/public").post(function(req, res) {
	var query = { username: req.body.username };
	console.log(query);
	
	User.findOne(query, function(err, user) {
		if (err) {
			res.send(err);
		}
		res.json(user);
	});
})

app.use("/api", router);

/* START SERVER */
app.listen(port, function() {
	console.log(`Server running on port ${port}`);
})