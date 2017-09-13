import React from "react";

import "../css/profileHome.css";

const ProfileHome = (props) => {
	return (
		<div className="profileHome">
			<div className="recentlyPlayedContainer">
				{ props.recentlyPlayedJsx }	
			</div>
		</div>
	);
}

export default ProfileHome;
