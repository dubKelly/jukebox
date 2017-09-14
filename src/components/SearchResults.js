import React from "react";

const SearchResults = (props) => {
	return (
		<div>
			<div className="artists">
				{props.artists}
			</div>
			<div className="albums">
				{props.albums}
			</div>
			<div className="tracks">
				{props.tracks}
			</div>
		</div>
	);
}
 
export default SearchResults;
