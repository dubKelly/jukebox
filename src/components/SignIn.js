import React from "react";

const SignIn = (props) => {
	return (
		<a href="http://localhost:8080/api/login" className="signIn nav">{props.signInText}</a>
	);
}

export default SignIn;
