import React from "react";
import axios from "axios";
import queryString from "query-string";

import Search from "../components/Search";

import "../css/public.css";

export default class Public extends React.Component {
	constructor() {
		super();
		this.state = {
			tokens: {},
			artistsJsx: [],
			albumsJsx: [],
			tracksJsx: []
		}
		this.getSearchResults = this.getSearchResults.bind(this);
	}

	componentDidMount() {
		let user = {
			username: window.location.hostname
		}

		axios.post("http://localhost:8080/api/public", user).then(res => {
			this.setState({ tokens: res.data }, () => {
				let time = (parseInt(this.state.tokens.expires_by, 10) - (new Date().getTime() / 1000)) * 100;
				console.log(time);
				setInterval(() => {
					axios.post("http://localhost:8080/api/public", user).then(res => {
						this.setState({ tokens: res.data });
						console.log("refesh:");
						console.log(res.data);
					});
				}, time);
			});
		});
	}

	render() {
		return (
			<div className="page public">
				<div className="container black">
					<Search 
						handleChange={this.getSearchResults}
						artists={this.state.artistsJsx}
						albums={this.state.albumsJsx}
						tracks={this.state.tracksJsx}
					/>
				</div>
			</div>
		);
	}

	/*** CUSTOM ***/

	getSearchResults(e) {
		let search = {
			q: e.target.value
		}
		let query = queryString.stringify(search);
		let url = `https://api.spotify.com/v1/search?${query}&type=artist,album,track&limit=5`;
		let body = {
			headers: { 
				"Authorization": `Bearer ${this.state.tokens.access_token}`
			}
		}

		axios.get(url, body).then(res => {
			const artists = res.data.artists.items;
			const albums = res.data.albums.items;
			const tracks = res.data.tracks.items;

			let artistsJsx = [];
			let albumsJsx = [];
			let tracksJsx = [];

			for (var i = 0; i < artists.length; i++) {
				let key = `artist${i}`;
				let followers = `${artists[i].followers.total} Followers`
				let smallImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz0hYyu3AlzkwJfXn3x_T-vihyySLKYx_3ZcbNfq3TU1ZXb4";
				let largeImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz0hYyu3AlzkwJfXn3x_T-vihyySLKYx_3ZcbNfq3TU1ZXb4";

				if (artists[i].images[2] !== undefined) {
					smallImg = artists[i].images[2].url;
				}
				if (artists[i].images[0] !== undefined) {
					largeImg = artists[i].images[0].url;
				}

				const artistStyles = {
					backgroundImage: `url(${smallImg})`,
					backgroundSize: "cover",
					backgroundPosition: "right center",
					backgroundRepeat: "no-repeat"
				}

				let jsx = <div className="result artist" key={key}>
										<div
											className="resultImg artist"										
											style={artistStyles}
											data-largeImg={largeImg}
										>
										</div>
										<div className="resultText">
											<h2>{artists[i].name}</h2>
											<h3>{followers}</h3>
										</div>
									</div>
				artistsJsx.push(jsx);
				this.setState({ artistsJsx });
			}

			for (let j = 0; j < albums.length; j++) {
				let key = `album${j}`
				let smallImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz0hYyu3AlzkwJfXn3x_T-vihyySLKYx_3ZcbNfq3TU1ZXb4";
				let largeImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz0hYyu3AlzkwJfXn3x_T-vihyySLKYx_3ZcbNfq3TU1ZXb4";

				if (albums[j].images[2] !== undefined) {
					smallImg = albums[j].images[2].url;
				}
				if (albums[j].images[0] !== undefined) {
					largeImg = albums[j].images[0].url;
				}

				const albumStyles = {
					backgroundImage: `url(${smallImg})`,
					backgroundSize: "cover",
					backgroundPosition: "right center",
					backgroundRepeat: "no-repeat"
				}

				console.log(artists);

				// TODO: catch this type error
				// TODO: render multiple artists

				let jsx = <div className="result album" key={key}>
										<div
											className="resultImg"
											style={albumStyles}
											data-largeImg={largeImg}
										>
										</div>
										<div className="resultText">
											<h2>{albums[j].name}</h2>
											<h3>{albums[j].artists[0].name}</h3>
										</div>
									</div>
				albumsJsx.push(jsx);
				this.setState({ albumsJsx });
			}

			// TODO: " "

			for (let k = 0; k <= tracks.length - 1; k++) {
				let key = `track${k}`;
				let jsx = <div 
										className="result track"
										key={key}
										data-artistHref={tracks[k].artists[0].href}
										data-trackHref={tracks[k].href}
									>
										<div className="resultText track">
											<h2>{tracks[k].name}</h2>
											<h3>{tracks[k].artists[0].name}</h3>
										</div>
									</div>
				tracksJsx.push(jsx);
				this.setState({ tracksJsx });
			}
		});
	}
}
