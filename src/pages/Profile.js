import React from "react";
import $ from "jquery";

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
					console.log(items[i]);
					let key = `playlist${i}`;
					let playlist =	<div key={key}>
														<img 
															src={ items[i].images[1].url }
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
			<div>
				{ this.state.playlists }
			</div>
		);
	}
}
