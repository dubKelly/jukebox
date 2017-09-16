import React from "react";

const SearchResults = (props) => {
	return (
		<div className="searchResults" ref={props.resultsRef}>
			<div className="searchCategory tracks open">
				{props.tracks}
			</div>
			<div className="searchCategory artists">
				{props.artists}
			</div>
			<div className="searchCategory albums">
				{props.albums}
			</div>
		</div>
	);
}
 
export default SearchResults;
