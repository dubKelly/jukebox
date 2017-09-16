import React from "react";

import SearchBar from "../components/SearchBar";
import Nav from "../components/Nav";
import SearchResults from "../components/SearchResults";

export default class Search extends React.Component {
	componentDidMount() {
		const nav = this.navBar.children;
		const result = this.results.children;

		for (let i = nav.length - 1; i >= 0; i--) {
			nav[i].index = i;
			
			nav[i].onclick = (e) => {
				for (var i = nav.length - 1; i >= 0; i--) {
					nav[i].classList.remove("open");
					result[i].classList.remove("open");
				}
				e.target.classList.add("open");
				result[e.target.index].classList.add("open");
			}
		}
	}

	render() {
		return (
			<div className="search">
				<SearchBar handleChange={this.props.handleChange} />
				<Nav navRef={el => this.navBar = el}/>
				<SearchResults 
					resultsRef={el => this.results = el}
					artists={this.props.artists}
					albums={this.props.albums}
					tracks={this.props.tracks} />
			</div>
		);
	}
}
