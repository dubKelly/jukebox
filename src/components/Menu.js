import React from "react";

import Burger from "./Burger";
import MenuDisplay from "./MenuDisplay";

export default class Menu extends React.Component {
	render() {
		return (
			<div>
				<Burger
					burgerRef={el => this.burger = el}
					toggleMenu={this.toggleMenu.bind(this)}
				/>
				<MenuDisplay menuRef={el => this.menu = el} />
			</div>
		);
	}

	/*** CUSTOM ***/

	toggleMenu = () => {
		this.burger.classList.toggle("open");
		this.menu.classList.toggle("open");
	}
}