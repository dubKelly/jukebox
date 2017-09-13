import React from "react";
import axios from "axios";
import queryString from "query-string";

import Search from "../components/Search";

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
			console.log(res);
			this.setState({ tokens: res.data }, () => {
				// kill loading animation
				console.log(this.state.tokens);
			});
		});
	}

	render() {
		return (
			<Search 
				handleChange={this.getSearchResults}
				artists={this.state.artistsJsx}
				albums={this.state.albumsJsx} />
		);
	}

	/*** CUSTOM ***/

	getSearchResults(e) {
		let search = {
			q: e.target.value
		}
		let query = queryString.stringify(search);
		let url = `https://api.spotify.com/v1/search?${query}&type=artist,album,track&limit=2`;
		let body = {
			headers: { 
				"Authorization": `Bearer ${this.state.tokens.access_token}`
			}
		}

		axios.get(url, body).then(res => {
			const artists = res.data.artists.items;
			const albums = res.data.albums.items;
			const tracks = res.data.tracks.items;

			console.log(albums);
			let artistsJsx = [];
			let albumsJsx = [];

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

				let jsx = <div className="artist" key={key}>
										<img 
											src={smallImg}
											alt=""
											data-largeImg={largeImg} />
										<h2>{artists[i].name}</h2>
										<h3>{followers}</h3>
									</div>
				artistsJsx.push(jsx);
				this.setState({ artistsJsx });
			}

			for (var i = 0; i <= albums.length -1; i++) {
				let key = `album${i}`
				let artists = "";
				let smallImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz0hYyu3AlzkwJfXn3x_T-vihyySLKYx_3ZcbNfq3TU1ZXb4";
				let largeImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJz0hYyu3AlzkwJfXn3x_T-vihyySLKYx_3ZcbNfq3TU1ZXb4";

				if (albums[i].images[2] !== undefined) {
					smallImg = albums[i].images[2].url;
				}
				if (albums[i].images[0] !== undefined) {
					largeImg = albums[i].images[0].url;
				}

				// TODO: catch this type error

				if (albums[i] === undefined || albums[i] === null || albums[i] === 0) {
					console.log("whoa!");
					console.log(albums[i]);
				}
				else if (albums[i] !== undefined) {
					console.log(albums[i]);
					for (let i = 0; i <= albums[i].artists.length - 1; i++) {
						artists += `${albums[i].artists[i].name} `
					} 
				}

				let jsx = <div className="artist" key={key}>
										<img 
											src={smallImg}
											alt=""
											data-largeImg={largeImg} />
										<h2>{albums[i].name}</h2>
										<h3>{"artists"}</h3>
									</div>
				albumsJsx.push(jsx);
				this.setState({ albumsJsx });
			}
		});
	}
}
