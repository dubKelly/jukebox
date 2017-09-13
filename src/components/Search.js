import React from "react";

import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

const Search = (props) => {
	return (
		<div className="search">
			<SearchBar handleChange={props.handleChange}/>
			<SearchResults 
				artists={props.artists}
				albums={props.albums} />
		</div>
	);
}

export default Search;
