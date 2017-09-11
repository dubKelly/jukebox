import React from "react";
import $ from "jquery";
import axios from "axios";

import Greeting from "../components/Greeting";
import Playlists from "../components/Playlists";

export default class Profile extends React.Component {
	constructor() {
		super();
		this.state = {
			tokens: {},
			profile: {},
			playlists: [],
			tracks: {}
		}
		this.getTracks = this.getTracks.bind(this);
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
		  });


		  // request profile info
		  $.ajax({
		  	url: "https://api.spotify.com/v1/me",
		  	headers: {
		  		"Authorization": `${tokens.token_type} ${tokens.access_token}`
		  	},
		  	success: (response) => {
		  		console.log(response);
		  		this.setState({ profile: response });

		  		let userHref = response.href;

		  		this.getPlaylists(tokens, userHref);
		  	}
		  });

		  // refresh access_token
		  let time = (parseInt(tokens.expires_in, 10) - 120) * 1000;	// 2 mins before token expires 
		  console.log(time);
		  setInterval(() => {
		  	$.ajax({
		  		url: "http://localhost:8080/api/refresh",
		  		data: {
		  			refresh_token: tokens.refresh_token
		  		},
		  		success: (response) => {
		  			let data = JSON.parse(response);
		  			let refresh_token = this.state.tokens.refresh_token;
			  		console.log(data);
			  		this.setState({
			  			tokens: {
			  				token_type: data.token_type,
			  				access_token: data.access_token,
			  				refresh_token: refresh_token,
			  				expires_in: data.expires_in
			  			}
			  		});
			  		this.postTokens();
			  	}
		  	});
		  }, time);
		}
	}

	postTokens() {
		let expires_by = (new Date().getTime() / 1000) + parseInt(this.state.tokens.expires_in, 10);

	  let user = {
	  	username: window.location.hostname,
	  	access_token: this.state.tokens.access_token,
	  	refresh_token: this.state.tokens.refresh_token,
	  	expires_by: expires_by
	  }

	  axios.post("http://localhost:8080/api/users", user).then(res => {
	  	// kill load animation
	  	console.log("db updated");
	  }).catch(err => {
	  	console.error(err);
	  });	
	}
    		
	getPlaylists(tokens, userHref) {
		$.ajax({
			url: `${userHref}/playlists`,
			headers: {
				"Authorization": `${tokens.token_type} ${tokens.access_token}`
			},
			success: (response) => {
				const items = response.items;
				let playlists = [];

				for (let i = items.length - 1; i >= 0; i--) {
					let key = `playlist${i}`;
					let playlist =	<div key={key}>
														<img 
															src={ items[i].images[2].url }
															alt=""
															data-href={ items[i].href }
															onClick={ this.getTracks } />
														<h2
															data-href={ items[i].href }
															onClick={ this.getTracks }>
															{ items[i].name }
														</h2>
													</div>
					playlists.push(playlist);
				}
				this.setState({ playlists });
			}
		});
	}

	getTracks(e) {

    console.log(this.state.profile);
    console.log(this.state.playlists);
    console.log(this.state.tracks);

		let targetHref = e.target.getAttribute("data-href");
		let token_type = this.state.tokens.token_type;
		let access_token = this.state.tokens.access_token;
		
		$.ajax({
			url: `${targetHref}/tracks`,
			headers: {
				"Authorization": `${token_type} ${access_token}`
			},
			success: (response) => {
				this.setState({ tracks: response });
			}
		});
	}

	nextTrack(e) {
		e.preventDefault();
		console.log(this.state.tokens.access_token);
		console.log(this.state.tokens.token_type);

		let token_type = this.state.tokens.token_type;
		let access_token = this.state.tokens.access_token;

		$.ajax({
			method: "POST",
	  	url: "https://api.spotify.com/v1/me/player/next",
	  	headers: {
	  		"Authorization": `${token_type} ${access_token}`
	  	},
	  	success: () => {
	  		console.log("next");
	  	}
	  });
	}

	render() {
		return (
			<div className="page profile dark">
				<Greeting name={ this.state.profile.id } />
				<Playlists playlists={ this.state.playlists } />
				<button onClick={ this.nextTrack.bind(this) }>Next</button>
			</div>
		);
	}
}
