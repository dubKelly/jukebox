import React from "react";
import {
	BrowserRouter as Router,
	Route
} from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";

export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			tokens: {},
			profile: {}
		}
	}

	setTokens(tokens) {
		this.setState({ tokens })
	}

	render() { 
		return (
			<Router>
				<div>
					<Route exact path="/" component={ Home } />
					<Route path="/profile" render={(props) => (
						<Profile {...props}
							setTokens={ this.setTokens.bind(this) }
						/>
					)}/>
				</div>
			</Router>
		);
	}
}