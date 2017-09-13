import React from "react";

import "../css/profileHome.css";

const ProfileHome = (props) => {
	return (
		<div className="profileHome">
			<div className="recentlyPlayedContainer">
				<h2 className="profileHomeTitle">{props.title}</h2>
				{ props.recentlyPlayedJsx }	
			</div>
		</div>
	);
}

export default ProfileHome;
