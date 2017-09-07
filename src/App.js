import React, { Component } from 'react';
import axios from "axios";

import Search from "./components/Search";

class App extends Component {
	constructor() {
		super();
		this.state = {
			serverUrl: "http://localhost:8080/api/keys",
			spotify: {
				keys: [],
				authUrl: "https://accounts.spotify.com/authorize",
				apiUrl: "https://api.spotify.com/v1",
			},
			searchValue: "",
			data: {}
		};
	}

	handleChange = (e) => {
		console.log(this.state.spotify.keys[0].client_id);
	}

	loadKeys() {
		axios.get(this.state.serverUrl).then(res => {
			this.setState({ spotify: { keys: res.data }});
		});
	}

	componentDidMount() {
		this.loadKeys();
	}

	render() {
		return (
			<Search handleChange={this.handleChange.bind(this)}/>
		);
	}
}

export default App;
