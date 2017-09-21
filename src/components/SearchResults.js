import React from "react";
import { Link } from "react-router-dom";

const SearchResults = (props) => {
	return (
		<div className="searchResults" ref={props.resultsRef}>
			<div
				className="searchCategory tracks open"
				onClick={props.tracksClick}
			>
				{props.tracks}
			</div>
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
