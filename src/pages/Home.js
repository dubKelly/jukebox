import React from "react";

import SignIn from "../components/SignIn";
import HomeTitle from "../components/HomeTitle";

import "../css/home.css";

export default class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			signInText: "Sign In",
			homeTitleText: "Biff"
		}
	}

	render() {
		return (
			<div className="page home">
				<div className="container black">
					<SignIn signInText={this.state.signInText} />
					<HomeTitle homeTitleText={this.state.homeTitleText} />
				</div>
			</div>
		);
	}
}
