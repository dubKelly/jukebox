import React from "react";

const ProfileHome = (props) => {
	console.log(props);
	return <div className="profileHome">{ props.recentlyPlayedJsx }</div>;
}

export default ProfileHome;
