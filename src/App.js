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
			tokens: {}
		}
	}

	setTokens(tokens) {
		this.setState({ tokens });
	}

	render() { 
		return (
			<Router>
				<div className="page">
					<Route exact path="/" component={ Home } />
					<Route path="/profile" render={(props) => (
						<Profile {...props}
							tokens={ this.state.tokens }
							setTokens={ this.setTokens.bind(this) }
						/>
					)}/>
				</div>
			</Router>
		);
	}
}