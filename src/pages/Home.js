import React from "react";

import Connect from "../components/Connect";

import "../css/home.css";

export default class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			signInText: "Sign In"
		}
	}

	render() {
		return (
			<div className="page dark">
				<Connect text={ this.state.signInText } />
			</div>
		);
	}
}
