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
	  console.log(data);
	}


	render() {
		const styles = {
			backgroundImage: `url("${this.state.data.artistImg}")`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
		}

		return (
			<div className="page track" style={styles}>
				<div className="container black">
					<div className="trackContent">
						<h2 className="trackName">{this.state.data.trackName}</h2>
						<h3 className="trackArtist">{this.state.data.artistName}</h3>
						<button 
							className="requestTrack"
							data-trackHref={this.state.data.trackHref}
							onClick={this.props.requestTrack}>
							Request Song
						</button>
					</div>
				</div>
			</div>
		);
	}
}
