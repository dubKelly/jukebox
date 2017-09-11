import React from "react";
import axios from "axios";
import $ from "jquery";

export default class Public extends React.Component {
	constructor() {
		super();
		this.state = {
			tokens: {}
		}
	}

	componentDidMount() {
		let user = {
			username: window.location.hostname
		}

		axios.post("http://localhost:8080/api/public", user).then(res => {
			console.log(res);
			this.setState({ tokens: res.data }, () => {
				// kill loading animation
				console.log(this.state.tokens);
			});
		});
	}

	nextTrack(e) {
		e.preventDefault();

		let access_token = this.state.tokens.access_token;

		$.ajax({
			method: "POST",
	  	url: "https://api.spotify.com/v1/me/player/next",
	  	headers: {
	  		"Authorization": `Bearer ${access_token}`
	  	},
	  	success: () => {
	  		console.log("next");
	  	}
	  });
	}

	render() {
		return (
			<button onClick={ this.nextTrack.bind(this) }>Next</button>
		);
	}
}
