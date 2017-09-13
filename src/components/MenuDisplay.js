import React from "react";

import "../css/menu.css"

const MenuDisplay = (props) => {
	return (
		<div className="menu" ref={props.menuRef}></div>
	);
}

export default MenuDisplay;
