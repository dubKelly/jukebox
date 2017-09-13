import React from "react";
import axios from "axios";
import queryString from "query-string";

import Search from "../components/Search";

export default class Public extends React.Component {
	constructor() {
		super();
		this.state = {
			tokens: {}
		}
		this.getSearchResults = this.getSearchResults.bind(this);
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

	render() {
		return (
			<Search handleChange={this.getSearchResults} />
		);
	}

	getSearchResults(e) {
		let search = {
			q: e.target.value
		}
		let query = queryString.stringify(search);
		let url = `https://api.spotify.com/v1/search?${query}&type=artist,album,track&limit=2`;
		let body = {
			headers: { 
				"Authorization": `Bearer ${this.state.tokens.access_token}`
			}
		}

		axios.get(url, body).then(res => {
			console.log(res);
		});
	}
}
