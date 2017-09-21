import React from "react";

export default class Tracks extends React.Component {
	constructor() {
		super();
		this.state = {
			data: {}
		}
	}

	componentWillMount() {
		let pairs = window.location.pathname.substring(8).split("&");
	  let data = {};

	  pairs.forEach((pair) => {
	  	pair = pair.split("=");
	  	data[pair[0]] = decodeURIComponent(pair[1] || "");
	  });
	  
	  this.setState({ data });
	}


	render() {
		const styles = {
			backgroundImage: `url("${this.state.data.artistImg}")`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
		}

		return (
			<div className="page" style={styles}>
				<div className="container black">
					<h2 style={{color: "white"}}>{this.state.data.trackName}</h2>
				</div>
			</div>
		);
	}
}
