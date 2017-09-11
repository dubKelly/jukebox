import React from "react";
import {
	BrowserRouter as Router,
	Route
} from "react-router-dom";

import Home from "./Home";
import Profile from "./Profile";
import Public from "./Public";

const App = () => {
	return (
		<Router>
			<div className="page">
				<Route exact path="/" component={ Home } />
				<Route path="/profile" component={ Profile } />
				<Route path="/public" component={ Public } />
			</div>
		</Router>
	);
}

export default App;
