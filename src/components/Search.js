import React from "react";

import SearchBar from "./SearchBar";

const Search = (props) => {
	return (
		<div className="search">
			<SearchBar handleChange={props.handleChange}/>
		</div>
	);
}

export default Search;
