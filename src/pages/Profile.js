import React from "react";
import { Route } from "react-router-dom";
import $ from "jquery";
import axios from "axios";

import Menu from "../components/Menu";
import ProfileHome from "./ProfileHome";
// import Greeting from "../components/Greeting";
// import Playlists from "../components/Playlists";

import "../css/profile.css";

export default class Profile extends React.Component {
	constructor() {
		super();
		this.state = {
			tokens: {},
			profile: {},
			recentlyPlayed: {},
			recentlyPlayedJsx: [],
			// playlists: {},
			// playlistsJsx: [],
			// tracks: {}
		}
		this.getRecentlyPlayed = this.getRecentlyPlayed.bind(this);
		// this.getPlaylists = this.getPlaylists.bind(this);
		// this.getTracks = this.getTracks.bind(this);
	}

	componentDidMount() {
		// refresh tokens on page refresh to sync expires_by with expires_in
		if (window.performance.navigation.type === 1) {
			window.location = "http://localhost:8080/api/login";
		}
		else {
			// pull tokens from pathname
		  let pairs = window.location.pathname.substring(9).split("&");
		  let result = {};

		  pairs.forEach((pair) => {
		  	pair = pair.split("=");
		  	result[pair[0]] = decodeURIComponent(pair[1] || "");
		  });

		  let tokens = JSON.parse(JSON.stringify(result));

		  this.setState({ tokens }, () => {
		  	// send tokens to db
			  this.postTokens();

			  // get profile info
		  	this.ajaxGet("https://api.spotify.com/v1/me", "profile", this.getRecentlyPlayed);
		  });

		  // refresh access_token
		  const time = (parseInt(tokens.expires_in, 10) - 300) * 1000;	// 5 mins before token expires 
		  
		  setInterval(() => {
		  	const body = {
		  		refresh_token: this.state.tokens.refresh_token
		  	}

		  	axios.get("http://localhost:8080/api/refresh", body).then(res => {
		  		const data = JSON.parse(res);
		  		const refresh_token = this.state.tokens.refresh_token;

		  		this.setState({
		  			tokens: {
		  				token_type: data.token_type,
		  				access_token: data.access_token,
		  				refresh_token: refresh_token,
		  				expires_in: data.expires_in
		  			}
		  		}, () => {
		  			this.postTokens();
		  		});
		  	});
		  }, time);
		}
	}

	/*** STYLES ***/

	styles = {
		backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz0hYyu3AlzkwJfXn3x_T-vihyySLKYx_3ZcbNfq3TU1ZXb4)",
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
	}

	/*** RENDER ***/

	render() {
		console.log(window.location);
		return (
			<div className="page profile" style={this.styles}>
				<div className="container profile">
					<Menu />
					<Route exact path={window.location.pathname} render={(props) =>
						<ProfileHome {...props} recentlyPlayedJsx={this.state.recentlyPlayedJsx} />
					}/>
				</div>
			</div>
		);
	}

	/*** CUSTOM ***/

	postTokens() {
		let expires_by = (new Date().getTime() / 1000) + parseInt(this.state.tokens.expires_in, 10);

	  let user = {
	  	username: window.location.hostname,
	  	access_token: this.state.tokens.access_token,
	  	refresh_token: this.state.tokens.refresh_token,
	  	expires_by: expires_by
	  }

	  axios.post("http://localhost:8080/api/users", user).then(res => {
	  	// TODO: kill load animation
	  	console.log("db updated");
	  }).catch(err => {
	  	console.error(err);
	  });	
	}

	renderRecentlyPlayed() {
		const items = this.state.recentlyPlayed.items;
		let context = [];
		let recentlyPlayedHref = [];

		// sort throught recently-played response and
		// check for duplicate artists/playlists
		for (let i = 0; i <= items.length - 1; i++) {
			if (context.includes(items[i].context.external_urls.spotify) === false) {
				context.push(items[i].context.external_urls.spotify);

				if (items[i].context.type === "artist") {
					recentlyPlayedHref.push(items[i].track.artists[0].href);

				}
				else if (items[i].context.type === "playlist") {
					recentlyPlayedHref.push(items[i].context.href);

				}
				else {
					console.log(items[i].context.type);
				}
			}
			continue;
		}

		let body = {
			headers: { 
				"Authorization": `${this.state.tokens.token_type} ${this.state.tokens.access_token}`
			}
		}

		let recentlyPlayedJsx = [];

		for (let i = 0; i <= recentlyPlayedHref.length -1; i++) {
			axios.get(recentlyPlayedHref[i], body).then(res => {
				let key = `recentlyPlayedJsx${i}`;
				let jsx =	<div
										key={key}
										className="recentlyPlayed"
										data-url={res.data.external_urls.spotify}
										onClick={this.openRecentlyPlayed}>
										<img src={res.data.images[1].url} alt=""/>
										<h2>{res.data.name}</h2>
									</div>

				recentlyPlayedJsx.push(jsx);
				this.setState({ recentlyPlayedJsx }); // TODO: fire just once
			});
		}
	}

	// renderPlaylists() {
	// 	const items = this.state.playlists.items;
	// 	let playlistsJsx = [];

	// 	for (let i = items.length - 1; i >= 0; i--) {
	// 		let key = `playlist${i}`;
	// 		let playlist =	<div key={key}>
	// 											<img 
	// 												src={ items[i].images[2].url }
	// 												alt=""
	// 												data-href={ items[i].href }
	// 												onClick={ this.getTracks } />
	// 											<h2
	// 												data-href={ items[i].href }
	// 												onClick={ this.getTracks }>
	// 												{ items[i].name }
	// 											</h2>
	// 										</div>
	// 		playlistsJsx.push(playlist);
	// 	}
	// 	this.setState({ playlistsJsx });
	// }

	/*** AJAX ***/

	getRecentlyPlayed() {
		const url = "https://api.spotify.com/v1/me/player/recently-played";

		this.ajaxGet(url, "recentlyPlayed", this.renderRecentlyPlayed);
	}

	// getPlaylists() {
	// 	const url = this.state.profile.href + "/playlists";

	// 	this.ajaxGet(url, "playlists", this.renderPlaylists);
	// }

	// getTracks(e) {
	// 	const url = e.target.getAttribute("data-href") + "/tracks";

	// 	this.ajaxGet(url, "tracks", null);
	// }

	// nextTrack(e) {
	// 	e.preventDefault();

	// 	console.log(this.state.profile);

	// 	let token_type = this.state.tokens.token_type;
	// 	let access_token = this.state.tokens.access_token;

	// 	$.ajax({
	// 		method: "POST",
	//   	url: "https://api.spotify.com/v1/me/player/next",
	//   	headers: {
	//   		"Authorization": `${token_type} ${access_token}`
	//   	},
	//   	success: () => {
	//   		console.log("next");
	//   	}
	//   });
	// }

	/*** METHODS ***/

	ajaxGet(url, target, then) {
		let body = {
			headers: { 
				"Authorization": `${this.state.tokens.token_type} ${this.state.tokens.access_token}`
			}
		}

	  axios.get(url, body).then(res => {
		  let data = JSON.stringify(res.data);
	  	this.setState(() => {
		  	let state = JSON.parse(JSON.stringify(`{"${target}":${data}}`));

	  		return (JSON.parse(state));
	  	}, then);
	  });
	}
}

