import React from "react";

const SearchBar = (props) => {
	return <input type="search" className="searchBar" onChange={props.handleChange}/>;    
}

export default SearchBar;
