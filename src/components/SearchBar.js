import React from "react";

import "../css/searchBar.css";

const SearchBar = (props) => {
	return <input type="search" className="searchBar" onChange={props.handleChange}/>;    
}

export default SearchBar;
