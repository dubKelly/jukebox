import React from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";

import Search from "./Search";
import Artists from "./Artists";
import Albums from "./Albums";
import Tracks from "./Tracks";

import "../css/public.css";

export default class Public extends React.Component {
	constructor() {
		super();
		this.state = {
			user: {
				username: window.location.hostname
			},
			tokens: {},
			requests: [],

			/* display */
			artistsJsx: [],
			albumsJsx: [],
			tracksJsx: [],
		}
		this.getSearchResults = this.getSearchResults.bind(this);
	}

	componentDidMount() {
		// TODO: fix interval
		// time is not updated with new token

		axios.post("http://localhost:8080/api/public", this.state.user).then(res => {
			console.log(res.data);
			const tokens = {
				access_token: res.data.access_token,
				expires_by: res.data.expires_by,
				refresh_token: res.data.refresh_token
			}

			this.setState({
				tokens,
				requests: res.data.requests
			}, () => {
				// refresh access_token
				let time = (parseInt(this.state.tokens.expires_by, 10) - (new Date().getTime() / 1000)) * 1000;

				setInterval(() => {
					axios.post("http://localhost:8080/api/public", this.state.user).then(res => {
						this.setState({ tokens: res.data },() => {
							time = time;
						});
					});
				}, time);
			});
		});
	}

	/*** RENDER ***/

	render() {
		return (
			<div className="page public">
				<div className="container black">
					<Route exact path="/public" render={(props) => 
						<Search {...props}
							handleChange={this.getSearchResults}
							tracks={this.state.tracksJsx}
							tracksClick={this.tracksClick.bind(this)}
							artists={this.state.artistsJsx}
							albums={this.state.albumsJsx}
						/>
					}/>
					<Route path="/public/artists" component={Artists}/>
					<Route path="/public/albums" component={Albums}/>
					<Route path="/public/:data" render={(props) =>
						<Tracks
							requestTrack={this.requestTrack.bind(this)}
						/>
					}/>
				</div>
			</div>
		);
	}

	/*** CUSTOM ***/

	getSearchResults(e) {
		// request search results from spotify
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
			// create jsx objects from response data
			// setState to jsx
			const artists = res.data.artists.items;
			const albums = res.data.albums.items;
			const tracks = res.data.tracks.items;

			let artistsJsx = [];
			let albumsJsx = [];
			let tracksJsx = [];

			for (var i = 0; i < artists.length; i++) {
				let key = `artist${i}`;
				let followers = `${artists[i].followers.total} Followers`
				// image placeholder
				// TODO: replace De Niro
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
				// image placeholder
				// TODO: replace De Niro
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

				// TODO: catch undefined type error
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

			// TODO: catch undefined type error
			// TODO: render multiple artists
			console.log(tracks);
			for (let k = 0; k <= tracks.length - 1; k++) {
				let key = `track${k}`;
				let jsx = <div 
										className="result track"
										key={key}>
										<div 
											className="cover"
											data-artistHref={tracks[k].artists[0].href}
											data-trackName={tracks[k].name}
											data-trackHref={tracks[k].href}>
										</div>
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

	tracksClick(e) {
		// get artist photo
		let url = e.target.getAttribute("data-artistHref");
		let trackName = e.target.getAttribute("data-trackName");
		let trackHref = e.target.getAttribute("data-trackHref");
		let body = {
			headers: { 
				"Authorization": `Bearer ${this.state.tokens.access_token}`
			}
		}
		console.log("click");

		axios.get(url, body).then(res => {
			let track = {
				artistImg: res.data.images[0].url,
				artistName: res.data.name,
				trackName,
				trackHref
			}

			let data = queryString.stringify(track);

			window.location.href = `http://localhost:3000/public/${data}`
		});
	}

	requestTrack(e) {
		const trackHref = e.target.getAttribute("data-trackHref");

		axios.post("http://localhost:8080/api/public", this.state.user).then(res => {
			this.setState({ requests: res.data.requests }, () => {
				const requests = this.state.requests;
				requests.push(trackHref);

				let user = {
			  	username: window.location.hostname,
			  	access_token: this.state.tokens.access_token,
			  	refresh_token: this.state.tokens.refresh_token,
			  	expires_by: this.state.tokens.expires_by,
			  	requests
			  }

			  axios.post("http://localhost:8080/api/users", user).then(res => {
			  	window.location.href = "http://localhost:3000/public";
			  }).catch(err => {
			  	console.error(err);
			  });
			});
		});
	}
}
