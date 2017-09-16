import React from "react";
import { Link } from "react-router-dom";

const SearchResults = (props) => {
	return (
		<div className="searchResults" ref={props.resultsRef}>
			<Link to="/tracks" className="searchCategory tracks open">
				{props.tracks}
			</Link>
			<Link to="/artists" className="searchCategory artists">
				{props.artists}
			</Link>
			<Link to="/albums" className="searchCategory albums">
				{props.albums}
			</Link>
		</div>
	);
}
 
export default SearchResults;
