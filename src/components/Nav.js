import React from "react";

import "../css/nav.css";

const Nav = () => {
	return (
		<ul className="navBar">
			<li className="nav tracks">Tracks</li>
			<li className="nav artists">Artists</li>
			<li className="nav albums">Albums</li>
		</ul>
	);
}

export default Nav;
