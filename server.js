'use strict';

var express = require("express");
var queryString = require("query-string");
var request = require("request");

var client_id = "b58fb769ae2c44f2a2072e027bd7fa67";
var client_secret = "6e13e849046949e28390b9e129d52e99";
var redirect_uri = "http://localhost:8080/api/callback";


/* INIT */
var app = express();
var router = express.Router();

var port = process.env.API_PORT || 8080;

/* ROUTES */
router.get("/login", function(req, res) {
	var authEndpoint = "https://accounts.spotify.com/authorize/?"
	var authQuery = queryString.stringify({
		client_id: client_id,
		response_type: "code",
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

			res.redirect("http://localhost:3000/" + queryString.stringify({
				token_type: token_type,
				access_token: access_token,
				refresh_token: refresh_token,
				expires_in: expires_in
			}));
		}
	});
});

app.use("/api", router);

/* START SERVER */
app.listen(port, function() {
	console.log(`Server running on port ${port}`);
})