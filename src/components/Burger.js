import React from "react";

import "../css/burger.css";

const Burger = (props) => {
	// const toggleBurger = (e) => {
	// 	const burger = e.target.parentNode;
	// 	const menu = ReactDOM.findDOMNode(Menu);
	// 	console.log(menu);

	// 	burger.classList.toggle("open");
	// }

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
