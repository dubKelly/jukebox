import React from "react";

import Connect from "./components/Connect";

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			tokens: {}
		}
	}

	componentDidMount() {
    // let pathParams = {};
    // let e;
    // let r = /([^&;=]+)=?([^&;]*)/g;
    // let q = window.location.pathname.substring(1);
    // while ( e = r.exec(q)) {
    //    pathParams[e[1]] = decodeURIComponent(e[2]);
    // }
    // this.setState({ tokens: pathParams });

    let pairs = window.location.pathname.substring(1).split("&");
    let result = {};

    pairs.forEach((pair) => {
    	pair = pair.split("=");
    	result[pair[0]] = decodeURIComponent(pair[1] || "");
    });

    let tokens = JSON.parse(JSON.stringify(result));
    console.log(tokens);

    this.setState({ tokens });
	}

	showTokens() {
		console.log(this.state.tokens.access_token);
	}

	render() { 
		return (
			<div>
			<Connect />
			<button onClick={this.showTokens.bind(this)}>Click</button>
			</div>
		);
	}
}