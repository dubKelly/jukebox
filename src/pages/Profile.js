import React from "react";
import $ from "jquery";

export default class Profile extends React.Component {
	componentDidMount() {
    let pairs = window.location.pathname.substring(9).split("&");
    let result = {};

    pairs.forEach((pair) => {
    	pair = pair.split("=");
    	result[pair[0]] = decodeURIComponent(pair[1] || "");
    });

    let tokens = JSON.parse(JSON.stringify(result));
    console.log(tokens);

    this.props.setTokens(tokens);

    $.ajax({
    	url: "https://api.spotify.com/v1/me",
    	headers: {
    		"Authorization": `${tokens.token_type} ${tokens.access_token}`
    	},
    	success: (response) => {
    		console.log(response);
    		// $.ajax({
    		// 	url: `${response.href}/tracks`,
    		// 	headers: {
	    	// 		"Authorization": `${tokens.token_type} ${tokens.access_token}`
    		// 	},
    		// 	success: (response) => {
    		// 		console.log(response);
    		// 	 }
    		// });
    	}
    });
	}

	render() {
		return (
			<h1>Profile Page</h1>
		);
	}
}
