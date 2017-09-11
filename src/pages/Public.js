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
		axios.get("http://localhost:8080/api/users").then(res => {
			this.setState({ tokens: res.data[0] });
		});
	}

	nextTrack(e) {
		e.preventDefault();
		console.log(this.state.tokens);

		let token_type = this.state.tokens.token_type;
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
