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
    let pathParams = {};
    let e;
    let r = /([^&;=]+)=?([^&;]*)/g;
    let q = window.location.pathname.substring(1);
    while ( e = r.exec(q)) {
       pathParams[e[1]] = decodeURIComponent(e[2]);
    }
    this.setState({ tokens: pathParams });
	}

	render() { 
		return (
			<div>
			<Connect />
			</div>
		);
	}
}