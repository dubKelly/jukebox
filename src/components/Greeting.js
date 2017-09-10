import React from "react";

import "../css/profile.css";

const Greeting = (props) => {
	return <h2 className="greeting">Welcome, { props.name }</h2>
}

export default Greeting;
