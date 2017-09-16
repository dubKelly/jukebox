import React from "react";

const Nav = (props) => {
	return (
		<ul className="navBar" ref={props.navRef}>
			<li className="nav tracks open">Tracks</li>
			<li className="nav artists">Artists</li>
			<li className="nav albums">Albums</li>
		</ul>
	);
}

export default Nav;
