import React from "react";
import $ from "jquery";

import Greeting from "../components/Greeting";
import Playlists from "../components/Playlists";

export default class Profile extends React.Component {
	constructor() {
		super();
		this.state = {
			profile: {},
			playlists: [],
			tracks: {}
		}
		this.getTracks = this.getTracks.bind(this);
	}

	componentDidMount() {
    let pairs = window.location.pathname.substring(9).split("&");
    let result = {};

    pairs.forEach((pair) => {
    	pair = pair.split("=");
    	result[pair[0]] = decodeURIComponent(pair[1] || "");
    });

    let tokens = JSON.parse(JSON.stringify(result));

    this.props.setTokens(tokens);

    $.ajax({
    	url: "https://api.spotify.com/v1/me",
    	headers: {
    		"Authorization": `${tokens.token_type} ${tokens.access_token}`
    	},
    	success: (response) => {
    		this.setState({ profile: response });

    		this.getPlaylists(tokens);
    	}
    });
	}
    		
	getPlaylists(tokens) {
		$.ajax({
			url: `${this.state.profile.href}/playlists`,
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
		let token_type = this.props.tokens.token_type;
		let access_token = this.props.tokens.access_token;
		
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

	render() {
		return (
			<div className="page profile dark">
				<Greeting name={ this.state.profile.id } />
				<Playlists playlists={ this.state.playlists } />
			</div>
		);
	}
}
