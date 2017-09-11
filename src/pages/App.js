import React from "react";
import {
	BrowserRouter as Router,
	Route
} from "react-router-dom";

import Home from "./Home";
import Profile from "./Profile";

const App = () => {
	return (
		<Router>
			<div className="page">
				<Route exact path="/" component={ Home } />
				<Route path="/profile" component={ Profile } />
				)}/>
			</div>
		</Router>
	);
}

export default App;
