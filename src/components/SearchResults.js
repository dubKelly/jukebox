import React from "react";

const SearchResults = (props) => {
	return (
		<div>
			{props.artists}
			{props.albums}
		</div>
	);
}
 
export default SearchResults;
