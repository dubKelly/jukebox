import React from "react";

const Connect = (props) => {
	return (
		<a href="http://localhost:8080/api/login" className="signIn">{ props.text }</a>
	);
}

export default Connect;
