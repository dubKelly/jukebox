import React from "react";

import SearchBar from "./SearchBar";
import Nav from "./Nav";
import SearchResults from "./SearchResults";

const Search = (props) => {
	return (
		<div className="search">
			<SearchBar handleChange={props.handleChange} />
			<Nav />
			<SearchResults 
				artists={props.artists}
				albums={props.albums}
				tracks={props.tracks} />
		</div>
	);
}

export default Search;
