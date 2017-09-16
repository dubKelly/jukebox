import React from "react";

import "../css/burger.css";

const Burger = (props) => {

	return (
		<div className="burger" ref={ props.burgerRef }>
			<span></span>
			<span></span>
			<span></span> 
			<span></span>
			<div className="cover" onClick={ props.toggleMenu }></div>
		</div>
	);
}

export default Burger;
